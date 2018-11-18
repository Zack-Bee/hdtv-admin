import React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from "@material-ui/icons/AddCircle"
import { lighten } from '@material-ui/core/styles/colorManipulator'
import blue from "@material-ui/core/colors/blue"
import red from "@material-ui/core/colors/red"

class EnhancedTableHead extends React.Component {
    render() {
        const {onSelectAllClick, numSelected, rowCount, heads } = this.props
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount && numSelected > 0}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {heads.map(head => {
                        return (
                            <TableCell
                                key={head.label}
                                numeric={false}
                                padding={head.disablePadding ? 'none' : 'default'}
                                sortDirection={false}
                            >
                                <TableSortLabel>
                                    {head.label}
                                </TableSortLabel>
                            </TableCell>
                        )
                    })}
                </TableRow>
            </TableHead>
        )
    }
}

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    red: {
        color: red[800]
    },
    blue: {
        color: blue[500]
    }
})

let EnhancedTableToolbar = props => {
    const { numSelected, classes } = props

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subheading">
                        选中 {numSelected} 个
                    </Typography>
                ) : (
                        <Typography variant="title" id="tableTitle">
                            {props.title}
                        </Typography>
                    )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="删除">
                        <IconButton className={classes.red} aria-label="删除" 
                            onClick={props.onClickDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="添加">
                        <IconButton className={classes.blue} aria-label="添加" 
                            onClick={props.onClickAdd}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    )
}

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar)

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
})

class EnhancedTable extends React.Component {
    render() {
        const {selected, classes, tableHeads, rows, title } = this.props
        const {rowsPerPage, page } = this.state
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

        return (
            <Paper className={classes.root}>
                <EnhancedTableToolbar numSelected={selected.length} 
                    title={title} onClickDelete={this.props.onClickDelete}
                    onClickAdd={this.props.onClickAdd}
                />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            heads={tableHeads}
                            rowCount={rows.length}
                            onSelectAllClick={this.props.onSelectAll}
                        />
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(list => {
                                    const isSelected = this.props.isSelected(list[0])
                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.props.onSelectOne(event, list[0])}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={list[0]}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {list[0]}
                                            </TableCell>
                                            {
                                                list.slice(1).map((info) => (
                                                    <TableCell key={list[0] + "$##%" + info}>{info}</TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    )
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        )
    }

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            rowsPerPage: 5,
        }
        this.handleChangePage = this.handleChangePage.bind(this)
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    }

    handleChangePage(event, page) {
        this.setState({ page })
    }

    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: event.target.value })
    }
}

export default withStyles(styles)(EnhancedTable)