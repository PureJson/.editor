import React, { useState } from 'react'
import DefaultEditor from '../../../core/editor/DefaultEditor'
import OpenEditors from '../open-editors/OpenEditors';

function Workspace() {
  const [editor, setEditor] = useState(<DefaultEditor content={{ "test": 0}}/>)
  const [page, setPage] = useState(1)

  return (
    <div>
      <OpenEditors 
        pages={['one', 'two', 'three']}
        page={page}
        setPage={setPage}
       />
      {editor ? editor : 'no content'}
    </div>
  )
}

export default Workspace;