import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/database/BaseModel';

@Table({ tableName: 'vacancies' })
export class Vacancy extends BaseModel {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
  })
  experience: number;

  @Column({
    type: DataType.INTEGER,
  })
  day: number;

  @Column({
    type: DataType.STRING,
  })
  start_hour: string;

  @Column({
    type: DataType.STRING,
  })
  end_hour: string;

  @Column({
    type: DataType.INTEGER,
  })
  salary: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  info: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hr_phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hr_email: string;
}
