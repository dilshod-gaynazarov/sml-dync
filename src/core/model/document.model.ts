import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';

@Table({ tableName: 'documents' })
export class Document extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  document: string;
}
