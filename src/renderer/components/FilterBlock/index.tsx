import React from 'react';
import TransformOpacity from '../Animations/TransformOpacity';
import { getAlphabetList } from '../../common/array';
import './index.css';

export default function FilterBlock(props: FilterBlockProps) {

    const { filterList, filter } = props;
    const alphabet = getAlphabetList();

    const handleSelectItem = (e: React.MouseEvent) => {

        props.onSelectItem(e);
    };

    return (
        <TransformOpacity cssAnimation={['transform']} className={'c-filter-block' +
        (filter === 'name' ? ' c-filter-block--grid' : '') +
        (filter === 'releaseDate' ? ' c-filter-block--row' : '')}>
            <div className="c-filter-block__container">
                {(filter === 'name' ? alphabet : filterList).map((item, index) => {


                    return (
                    <div onClick={handleSelectItem} key={index} className={'c-filter-block__item' +
                    (filter === 'name' && !filterList.find(x => x === item) ? ' disabled' : '')}>
                        <span>{item}</span>
                    </div>)
                })}
            </div>
        </TransformOpacity>
    );
}

interface FilterBlockProps {
    filterList: any[];
    filter: string;
    onSelectItem: (e: React.MouseEvent) => void;
};