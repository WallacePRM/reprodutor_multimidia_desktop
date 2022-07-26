import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('folders')
export class Folder {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable: false})
    type: string;
    @Column({nullable: false})
    path: string;
}
