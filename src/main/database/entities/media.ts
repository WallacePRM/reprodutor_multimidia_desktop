import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./playlist";

@Entity('medias')
export class Media {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable: false})
    type: string;
    @Column({nullable: false})
    name: string;
    @Column({nullable: true})
    author: string;
    @Column({nullable: true})
    album: string;
    @Column({nullable: true})
    genre: string;
    @Column({nullable: true})
    thumbnail: string;
    @Column({nullable: false})
    filename: string;
    @Column({nullable: true})
    duration: number;
    @Column({nullable: true})
    releaseDate: Date;
}
