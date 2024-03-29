import React from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../components/Button';
import { Folder } from '../../../../common/folders/type';

export default function PathItem(props: PathItemProps) {

    const { pathItem, onDelete } = props;

    const handleDelete = async () => {

        onDelete(pathItem);
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

interface PathItemProps {
    pathItem: Folder,
    onDelete: (pathItem: Folder) => void
};