import { Post } from "src/Post/post.entity";
import { DataType, Model, PrimaryKey, Table, Column, Default, HasMany, Unique } from "sequelize-typescript";

@Table
export class User extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        primaryKey: true,
    })
    id:string;

    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name:string;

    @Unique
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email:string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password:string;

    @HasMany(() => Post)  
    posts: Post[];  
}