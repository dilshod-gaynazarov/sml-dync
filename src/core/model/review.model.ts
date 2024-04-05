import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';
import { Languages } from 'src/common/database/Enums';

@Table({ tableName: 'reviews' })
export class Review extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  info: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  stars: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  language: Languages;
}
