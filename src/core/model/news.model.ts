import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';
import { Languages } from 'src/common/database/Enums';

@Table({ tableName: 'news' })
export class News extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  start_date: string;

  @Column({
    type: DataType.BIGINT,
  })
  end_date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lang: Languages;
}
