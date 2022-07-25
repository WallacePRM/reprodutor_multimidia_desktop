import React from 'react';
import TransformOpacity from '../Animations/TransformOpacity';

import './index.css';

function FilterBlock(props: FilterBlockProps) {

    const { filterList, filter } = props;
    const alphabet = [ '&', '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '...'];

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

type FilterBlockProps = {
    filterList: any[];
    filter: string;
    onSelectItem: (e: React.MouseEvent) => void;
};

export default FilterBlock;