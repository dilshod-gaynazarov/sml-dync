import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';

@Table({ tableName: 'certificates' })
export class Certificate extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  certificate: string;
}
