import { DataType, Model, Table, Column, ForeignKey } from "sequelize-typescript";
import { User } from "./user.entity";

@Table
export class Follow extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id:string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    followerId:string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    followedId:string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    createdAt: Date;
}