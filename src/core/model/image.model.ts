import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';

@Table({ tableName: 'images' })
export class Image extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;
}
