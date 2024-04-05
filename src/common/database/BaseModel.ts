import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({})
export class BaseModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDeleted: boolean;

  @Column({
    type: DataType.STRING,
    defaultValue: '',
  })
  deletedAt: Date;
}
