import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../components/Button';
import { getFolderService } from '../../../service/folder';
import { Folder } from '../../../../common/folders/type';

function PathItem(props: PathItemProps) {

    const { pathItem } = props;

    const handleDelete = async () => {

        props.onDelete(pathItem);
    };

    return (
        <div className="c-configs__block__content__item__list__item">
            <div className="c-configs__block__content__item__list__item__label">
                <span>{pathItem.path}</span>
            </div>
            <div className="c-configs__block__content__item__list__item__actions">
                <Button onClick={handleDelete} icon={faTimes} />
            </div>
        </div>
    );
}

type PathItemProps = {
    pathItem: Folder,
    onDelete: (pathItem: Folder) => void
};

export default PathItem;