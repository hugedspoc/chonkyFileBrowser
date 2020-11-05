import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';

import { selectDisplayFileIds, selectFileViewConfig } from '../../redux/selectors';
import { FileViewConfig, FileViewMode } from '../../types/file-view.types';
import { c, makeGlobalChonkyStyles, makeLocalChonkyStyles } from '../../util/styles';
import { FileListEmpty } from './FileListEmpty';
import { GridContainer } from './GridContainer';
import { ListContainer } from './ListContainer';

export interface FileListProps {}

export const FileList: React.FC<FileListProps> = React.memo(() => {
    const displayFileIds = useSelector(selectDisplayFileIds);
    const viewConfig = useSelector(selectFileViewConfig);

    const localClasses = useLocalStyles(viewConfig);
    const classes = useStyles(viewConfig);

    // In Chonky v0.x, this field was user-configurable. In Chonky v1.x+, we hardcode
    // this to `true` to simplify configuration. Users can just wrap Chonky in their
    // own `div` if they want to have finer control over the height.
    const fillParentContainer = true;

    const listRenderer = useCallback(
        ({ width, height }: { width: number; height: number }) => {
            if (displayFileIds.length === 0) {
                return <FileListEmpty width={width} height={viewConfig.entryHeight} />;
            } else if (viewConfig.mode === FileViewMode.List) {
                return <ListContainer width={width} height={height} />;
            } else {
                return <GridContainer width={width} height={height} />;
            }
        },
        [displayFileIds, viewConfig]
    );

    return (
        <div
            className={c([classes.fileListWrapper, localClasses.fileListWrapper])}
            role="list"
        >
            <AutoSizer disableHeight={!fillParentContainer}>{listRenderer}</AutoSizer>
        </div>
    );
});

const useLocalStyles = makeLocalChonkyStyles((theme) => ({
    fileListWrapper: {
        minHeight: (viewConfig: FileViewConfig) => viewConfig.entryHeight,
    },
}));

const useStyles = makeGlobalChonkyStyles(() => ({
    fileListWrapper: {
        height: '100%',
    },
}));
