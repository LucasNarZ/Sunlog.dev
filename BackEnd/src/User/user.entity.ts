import { Post } from "src/Post/post.entity";
import { UUIDV4 } from "sequelize";
import { DataType, Model, PrimaryKey, Table, Column, Default, HasMany } from "sequelize-typescript";

@Table
export class User extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    @Default(UUIDV4())
    id:string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name:string;

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