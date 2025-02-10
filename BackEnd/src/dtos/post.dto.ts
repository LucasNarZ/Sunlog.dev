export class createPostDto {
    readonly title:string;
    readonly content: string;
    readonly author:string;
    readonly categorys?:string[];
    readonly tags?:string[];
}