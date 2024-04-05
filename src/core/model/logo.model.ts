import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';

@Table({ tableName: 'logos' })
export class Logo extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo: string;
}
