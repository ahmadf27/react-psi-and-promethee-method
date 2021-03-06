import React, { memo, Fragment, Component } from 'react'
import { Box } from 'libs'

import TableToPrint from './table-to-print'

class Print extends Component {
    render() {
        const { ref, data, dataToPrint } = this.props

        const dataToBePrint = data?.slice(0, parseInt(dataToPrint))

        return (
            <div ref={ref}>
                <Fragment>
                    <Box title='Data Pengajuan'>
                        <TableToPrint dataPengajuan={dataToBePrint} />
                    </Box>
                </Fragment>
            </div>
        )
    }
}

export default memo(Print)
