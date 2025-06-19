import { Post } from "src/Post/post.entity";
import { DataType, Model, Table, Column, Default, HasMany, Unique } from "sequelize-typescript";

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

    @Default("https://deepgrouplondon.com/wp-content/uploads/2019/06/person-placeholder-5.png")
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    profileImgUrl:string;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    followers: number;

    @Default("")
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    bio: string;

    @HasMany(() => Post)  
    posts: Post[];  
}