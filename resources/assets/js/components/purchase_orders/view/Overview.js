import React from 'react'
import { ListGroup, Row } from 'reactstrap'
import ViewEntityHeader from '../../common/entityContainers/ViewEntityHeader'
import { translations } from '../../utils/_translations'
import InfoMessage from '../../common/entityContainers/InfoMessage'
import EntityListTile from '../../common/entityContainers/EntityListTile'
import { icons } from '../../utils/_icons'
import FieldGrid from '../../common/entityContainers/FieldGrid'
import LineItem from '../../common/entityContainers/LineItem'
import TotalsBox from '../../common/entityContainers/TotalsBox'
import PurchaseOrderPresenter from '../../presenters/PurchaseOrderPresenter'
import FormatDate from '../../common/FormatDate'
import FormatMoney from '../../common/FormatMoney'

export default function Overview (props) {
    const company = props.companies.filter(company => company.id === parseInt(props.entity.company_id))

    let user = null

    if (props.entity.assigned_to) {
        const assigned_user = JSON.parse(localStorage.getItem('users')).filter(user => user.id === parseInt(props.entity.assigned_to))
        user = <EntityListTile entity={translations.user}
            title={`${assigned_user[0].first_name} ${assigned_user[0].last_name}`}
            icon={icons.user}/>
    }

    const fields = []

    if (props.entity.custom_value1.length) {
        const label1 = props.model.getCustomFieldLabel('PurchaseOrder', 'custom_value1')
        fields[label1] = props.model.formatCustomValue(
            'PurchaseOrder',
            'custom_value1',
            props.entity.custom_value1
        )
    }

    if (props.entity.custom_value2.length) {
        const label2 = props.model.getCustomFieldLabel('PurchaseOrder', 'custom_value2')
        fields[label2] = props.model.formatCustomValue(
            'PurchaseOrder',
            'custom_value2',
            props.entity.custom_value2
        )
    }

    if (props.entity.custom_value3.length) {
        const label3 = props.model.getCustomFieldLabel('PurchaseOrder', 'custom_value3')
        fields[label3] = props.model.formatCustomValue(
            'PurchaseOrder',
            'custom_value3',
            props.entity.custom_value3
        )
    }

    if (props.entity.custom_value4.length) {
        const label4 = props.model.getCustomFieldLabel('PurchaseOrder', 'custom_value4')
        fields[label4] = props.model.formatCustomValue(
            'PurchaseOrder',
            'custom_value4',
            props.entity.custom_value4
        )
    }

    fields.date = <FormatDate date={props.entity.date}/>

    if (props.entity.po_number && props.entity.po_number.length) {
        fields.po_number = props.entity.po_number
    }

    if (props.entity.due_date && props.entity.due_date.length) {
        fields.expiry_date = <FormatDate date={props.entity.due_date}/>
    }

    if (props.entity.discount_total && props.entity.discount_total.toString().length) {
        fields.discount = <FormatMoney customers={props.customers}
            amount={props.entity.discount_total}/>
    }

    if (props.entity.balance > 0) {
        fields.balance_due = <FormatMoney customers={props.customers} amount={props.entity.balance}/>
    }

    if (props.entity.partial > 0) {
        fields.partial_due = <FormatMoney customers={props.customers} amount={props.entity.partial}/>
    }

    return <React.Fragment>
        <ViewEntityHeader heading_1={translations.total} value_1={props.entity.total}
            heading_2={translations.balance} value_2={props.entity.balance}/>

        <PurchaseOrderPresenter entity={props.entity} field="status_field"/>

        {!!props.entity.internal_note.length &&
        <Row>
            <InfoMessage icon={icons.lock} message={props.entity.internal_note}/>
        </Row>
        }

        {!!props.entity.customer_note.length &&
        <Row>
            <InfoMessage message={props.entity.customer_note}/>
        </Row>
        }

        <Row>
            <EntityListTile entity={translations.company} title={company[0].name}
                icon={icons.company}/>
        </Row>

        {!!user &&
        <Row>
            {user}
        </Row>
        }

        <FieldGrid fields={fields}/>

        <Row>
            <ListGroup className="col-12 mt-4">
                {props.entity.line_items.map((line_item, index) => (
                    <LineItem customers={props.companies} key={index} line_item={line_item}/>
                ))}
            </ListGroup>
        </Row>

        <Row className="justify-content-end">
            <TotalsBox customers={props.companies} entity={props.entity}/>
        </Row>
    </React.Fragment>
}
