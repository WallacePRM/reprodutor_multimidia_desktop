import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IoMusicalNotesOutline } from "react-icons/io5";
import { IoFilmOutline } from "react-icons/io5";
import { formatStrHHMMSS } from "../../../common/time";
import { removeMediaExt } from "../../../common/string";
import GenericGridItem from "../GenericGridItem";
import useGridItem from "./hook";
import { GenericItemData, GridItemFileProps } from "../models";
import './index.css';

export default function GridItem(props: GridItemFileProps) {

    const { className, pageConfig, file, noSelect, 
            onRemove, handleRemoveMedia, handlePlay, handleSelectMedia } = useGridItem(props);
    
    const thumbnail = (
    <div className="h-100 w-100">
       <LazyLoadImage key={file.id} style={{borderRadius: 0}} src={file.thumbnail}/>
    </div>);

    const icon = <div className="c-grid-list__item__icon">
        {file.type === 'video' && <IoFilmOutline className='icon-color--light' />}
        { file.type === 'music' && <IoMusicalNotesOutline className="icon-color--light"/>}
    </div>;

    const item: GenericItemData = {
        id: file.id,
        description: file.type === 'video' ? (file.duration > 0 ? formatStrHHMMSS(file.duration) : '') : (file.author || ''),
        thumbnails: [file.thumbnail && pageConfig.mediaArt ? thumbnail : icon],
        thumbnailType: 'img',
        media: file,
        title: removeMediaExt(file.name) + (file.author ? ` - ${file.author}` : ''),
    };

    return (
        <GenericGridItem
        noSelect={noSelect}
        className={className ? className : ''}
        item={item}
        key={file.id}
        onSelectMedia={handleSelectMedia}
        onPlay={handlePlay}
        onRemove={onRemove ? handleRemoveMedia : null}/>
    )
}