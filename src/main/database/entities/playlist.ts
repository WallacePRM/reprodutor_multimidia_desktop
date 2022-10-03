import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import { Media } from "./media";

@Entity('playlists')
export class Playlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: true})
    modificationDate: Date | null;

    @ManyToMany(() => Media, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    @JoinTable({
        name: 'playlist_items'
    })
    medias: Media[];
}
