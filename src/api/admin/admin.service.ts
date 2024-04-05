import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from 'src/core/model/admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { BcryptEncryption } from 'src/infrastructure/lib/crypto/bcrypt';
import { Roles } from 'src/common/database/Enums';
import { LoginAdminDto } from './dto/login-admin.dto';
import { LoginOrPasswordIncorrect } from './exception/login-or-password-incorrect.exception';
import { checkToken, generateToken } from '../auth/token/token';
import { AdminNotFoundById } from './exception/admin-not-found-by-id.exception';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Request } from 'express';
import { Forbidden } from './exception/forbidden.exception';
import { AlreadyExistAdmin } from './exception/already-exist-admin.exception';
import { ForbiddenAdmin } from './exception/forbidden-admin.exception';
import { OldPasswordIncorrect } from './exception/old-password-incorrect.dto';
import { ConfirmNewPasswordIncorrect } from './exception/confirm-new-password-incorrect';
import { AlreadyExistAdminPhone } from './exception/already-exist-admin-phone.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly repository: typeof Admin,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  async createAdmin(dto: CreateAdminDto): Promise<object> {
    const exist = await this.repository.count();
    if (exist) {
      throw new ForbiddenException('Super admin already exist!');
    }
    const hashed_password = await BcryptEncryption.decrypt(dto.password);
    const super_admin = await this.repository.create({
      ...dto,
      password: hashed_password,
      role: Roles.ADMIN,
    });
    const access_token = await generateToken(
      { id: super_admin.id, role: super_admin.role },
      this.jwtService,
    );
    return {
      token: access_token,
      data: super_admin,
      status: 201,
      message: 'Super admin created succesfully',
    };
  }

  async createManager(dto: CreateAdminDto): Promise<object> {
    const exist_login = await this.repository.findOne({
      where: { login: dto.login },
    });
    if (exist_login) {
      throw new AlreadyExistAdmin();
    }
    const exist_phone = await this.repository.findOne({
      where: { phone: dto.phone },
    });
    if (exist_phone) {
      throw new AlreadyExistAdminPhone();
    }
    const hashed_password = await BcryptEncryption.decrypt(dto.password);
    const manager = await this.repository.create({
      ...dto,
      role: Roles.MANAGER,
      password: hashed_password,
    });
    return {
      data: manager,
      status: 201,
      message: 'Admin created succesfully',
    };
  }

  async login(dto: LoginAdminDto): Promise<object> {
    const admin = await this.repository.findOne({
      where: { login: dto.login },
    });
    if (!admin) {
      throw new LoginOrPasswordIncorrect();
    }
    const encrypted_password = await BcryptEncryption.encrypt(
      dto.password,
      admin.password,
    );
    if (!encrypted_password) {
      throw new LoginOrPasswordIncorrect();
    }
    const access_token = await generateToken(
      { id: admin.id, role: admin.role },
      this.jwtService,
    );
    return {
      access_token,
      data: admin,
      status: 200,
      message: 'Logged in successfully',
    };
  }

  async getAllAdmins(): Promise<object> {
    const cached_data = await this.cacheManager.get('admins');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'All admins are fetched',
      };
    }
    const admins = await this.repository.findAll({
      where: { role: Roles.MANAGER },
      order: [['createdAt', 'DESC']],
    });
    await this.cacheManager.set('admins', admins, 60);
    return {
      data: admins,
      status: 200,
      message: 'All admins are fetched',
    };
  }

  async paginationAdmins(page: number, limit?: number): Promise<object> {
    if (!limit) {
      limit = 10;
    }
    const offset = (page - 1) * limit;
    const admins = await this.repository.findAll({
      offset,
      limit,
      where: { role: Roles.MANAGER },
      order: [['createdAt', 'DESC']],
    });
    const total_count = await this.repository.count();
    const total_pages = Math.ceil(total_count / limit);
    return {
      data: {
        records: admins,
        pagination: {
          currentPage: Number(page),
          total_pages,
          total_count,
        },
      },
      status: 200,
      message: 'Admin are fetched with pagination',
    };
  }

  async getAdminByID(id: number): Promise<object> {
    const cached_data = await this.cacheManager.get('admin');
    if (cached_data) {
      return {
        data: cached_data,
        status: 200,
        message: 'Admin fetched by ID',
      };
    }
    const admin = await this.getOne(id);
    await this.cacheManager.set('admin', admin, 60);
    return {
      data: admin,
      status: 200,
      message: 'Admin fetched by ID',
    };
  }

  async updateProfile(
    id: number,
    req: Request,
    dto: UpdateAdminDto,
  ): Promise<object> {
    const admin: any = await this.getOne(id);
    const data: any = await checkToken(req, this.jwtService);
    let profile: any;
    if (dto.login) {
      const exist = await this.repository.findOne({
        where: { login: dto.login },
      });
      if (exist) {
        if (exist.id != id) {
          throw new AlreadyExistAdmin();
        }
      }
    }
    if (dto.phone) {
      const exist_phone = await this.repository.findOne({
        where: { phone: dto.phone },
      });
      if (exist_phone) {
        if (exist_phone.id != id) {
          throw new AlreadyExistAdminPhone();
        }
      }
    }
    if (dto.new_password) {
      if (dto.new_password != dto.confirm_new_password) {
        throw new ConfirmNewPasswordIncorrect();
      }
      if (data.role == Roles.MANAGER && admin.role == Roles.ADMIN) {
        throw new ForbiddenAdmin();
      }
      if (data.role == Roles.ADMIN && admin.role == Roles.MANAGER) {
        const hashed_password = await BcryptEncryption.decrypt(
          dto.confirm_new_password,
        );
        profile = await this.repository.update(
          { ...dto, password: hashed_password },
          {
            where: { id },
            returning: true,
          },
        );
        return {
          data: profile[1][0],
          status: 200,
          message: 'Profile information edited successfully',
        };
      }
      if (
        (data.role == Roles.MANAGER && admin.role == Roles.MANAGER) ||
        (data.role == Roles.ADMIN && admin.role == Roles.ADMIN)
      ) {
        if (!dto.old_password) {
          throw new OldPasswordIncorrect();
        }
        const compared_password: any = await BcryptEncryption.encrypt(
          dto.old_password,
          admin.password,
        );
        if (!compared_password) {
          throw new OldPasswordIncorrect();
        }
        const hashed_password = await BcryptEncryption.decrypt(
          dto.confirm_new_password,
        );
        profile = await this.repository.update(
          { ...dto, password: hashed_password },
          {
            where: { id },
            returning: true,
          },
        );
        return {
          data: profile[1][0],
          status: 200,
          message: 'Profile information edited successfully',
        };
      }
    }
    profile = await this.repository.update(dto, {
      where: { id },
      returning: true,
    });
    return {
      data: profile[1][0],
      status: 200,
      message: 'Profile information edited successfully',
    };
  }

  async deleteAdmin(id: number, req: Request): Promise<object> {
    const admin: any = await this.getOne(id);
    const data: any = await checkToken(req, this.jwtService);
    if (data.role == Roles.MANAGER || admin.role == Roles.ADMIN) {
      throw new Forbidden();
    }
    await admin.destroy();
    return {
      status: 200,
      message: 'Admin deleted successfully',
    };
  }

  async getOne(id: number): Promise<Admin> {
    const admin = await this.repository.findByPk(id);
    if (!admin) {
      throw new AdminNotFoundById();
    }
    return admin;
  }
}
