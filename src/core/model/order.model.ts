import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';

@Table({ tableName: 'orders' })
export class Order extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  enterprises: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.JSONB,
  })
  requirements: any;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  file: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  product_title: string;
}
