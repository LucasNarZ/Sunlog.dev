import { DataType, Model, Table, Column, ForeignKey } from "sequelize-typescript";
import { Post } from "./post.entity";
import { User } from "src/User/user.entity";

@Table
export class Like extends Model {
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
    likerId:string;

    @ForeignKey(() => Post)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    likedId:string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    createdAt: Date;
}