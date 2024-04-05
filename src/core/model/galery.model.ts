import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';

@Table({ tableName: 'galery' })
export class Galery extends BaseModel {
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  photo: string;
}
