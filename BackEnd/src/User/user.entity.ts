import { Post } from "src/Post/post.entity";
import { DataType, Model, PrimaryKey, Table, Column, Default, HasMany, Unique, AllowNull } from "sequelize-typescript";

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

    @Default("https://thumbs.dreamstime.com/b/default-profile-picture-icon-high-resolution-high-resolution-default-profile-picture-icon-symbolizing-no-display-picture-360167031.jpg")
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