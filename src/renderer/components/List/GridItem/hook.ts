import { useSelector } from "react-redux";
import { selectPageConfig } from "../../../store/pageConfig";
import { GridItemFileProps } from "../models";

export default function useGridItem(props: GridItemFileProps) {

    const { noSelect, className, file, onPlay, onSelectMedia, onRemove } = props;
    const pageConfig = useSelector(selectPageConfig);

    const handleSelectMedia = () => {

        onSelectMedia(file);
    };

    const handlePlay = () => {

        onPlay(file);
    };

    const handleRemoveMedia = () => {

        onRemove(file);
    };

    return {
        className,
        pageConfig,
        file,
        noSelect,
        onRemove,
        handleRemoveMedia,
        handlePlay,
        handleSelectMedia
    };
}