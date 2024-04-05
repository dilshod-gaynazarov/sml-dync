import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';
import { Roles } from 'src/common/database/Enums';

@Table({ tableName: 'admins' })
export class Admin extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: Roles.MANAGER,
  })
  role: Roles;
}
