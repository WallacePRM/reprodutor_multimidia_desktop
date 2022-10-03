import React from "react";
import { useSelector } from "react-redux";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { IoMusicalNotesOutline } from "react-icons/io5";
import { IoFilmOutline } from "react-icons/io5";

import { Media } from '../../../../common/medias/types';
import { formatStrHHMMSS } from "../../../common/time";
import { selectPageConfig } from "../../../store/pageConfig";
import { removeMediaExt } from "../../../common/string";
import GenericGridItem, { GenericItemData } from "../GenericGridItem";

import './index.css';

function GridItem(props: FileProps) {

    const { noSelect, file, className, onPlay, onSelectMedia } = props;

    const pageConfig = useSelector(selectPageConfig);

    const thumbnail = (
    <div className="h-100 w-100">
       <LazyLoadImage key={file.id} style={{borderRadius: 0}} src={file.thumbnail}/>
    </div>);

    const icon = <div className="c-grid-list__item__icon">
        {file.type === 'video' && <IoFilmOutline className='icon-color--light' />}
        { file.type === 'music' && <IoMusicalNotesOutline className="icon-color--light"/>}
    </div>;

    const handleSelectMedia = () => {

        onSelectMedia(file);
    };

    const handlePlay = () => {

        onPlay(file);
    };

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
        />
    )
}

type FileProps = {
    noSelect?: boolean,
    file: Media & {
        selected?: boolean,
    },
    className?: string,
    onPlay: (file: Media) => void,
    onSelectMedia: (file: Media) => void,
};

export default GridItem;