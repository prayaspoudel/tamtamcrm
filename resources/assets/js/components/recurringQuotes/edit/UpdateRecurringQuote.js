import React, { Component } from 'react'
import axios from 'axios'
import {
    Button,
    Col,
    DropdownItem,
    Modal,
    ModalBody,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap'
import 'react-dates/lib/css/_datepicker.css'
import moment from 'moment'
import SuccessMessage from '../../common/SucessMessage'
import ErrorMessage from '../../common/ErrorMessage'
import AddButtons from '../../common/AddButtons'
import Contacts from './Contacts'
import Items from './Items'
import Documents from './Documents'
import Notes from '../../common/Notes'
import CustomFieldsForm from '../../common/CustomFieldsForm'
import InvoiceSettings from '../../common/InvoiceSettings'
import { CalculateLineTotals, CalculateSurcharges, CalculateTotal } from '../../common/InvoiceCalculations'
import DropdownMenuBuilder from '../../common/DropdownMenuBuilder'
import Emails from '../../emails/Emails'
import { icons } from '../../utils/_icons'
import { translations } from '../../utils/_translations'
import { consts } from '../../utils/_consts'
import NoteTabs from '../../common/NoteTabs'
import Contactsm from './Contactsm'
import Recurring from './Recurring'
import DefaultModalHeader from '../../common/ModalHeader'
import DefaultModalFooter from '../../common/ModalFooter'
import CustomerModel from '../../models/CustomerModel'
import TotalsBox from '../../invoice/edit/TotalsBox'
import InvoiceReducer from '../../invoice/InvoiceReducer'
import TaskRepository from '../../repositories/TaskRepository'
import ExpenseRepository from '../../repositories/ExpenseRepository'
import ProjectRepository from '../../repositories/ProjectRepository'
import { getExchangeRateWithMap } from '../../utils/_money'
import RecurringQuoteModel from '../../models/RecurringQuoteModel'
import Recurringm from './Recurringm'
import Details from './Details'
import { toast, ToastContainer } from 'react-toastify'

class UpdateRecurringQuote extends Component {
    constructor (props, context) {
        super(props, context)

        const data = this.props.invoice ? this.props.invoice : null
        this.quoteModel = new RecurringQuoteModel(data, this.props.customers)
        this.initialState = this.quoteModel.fields
        this.initialState.customers = this.state.customers || []
        this.state = this.initialState

        this.updateData = this.updateData.bind(this)
        this.saveData = this.saveData.bind(this)
        this.setTotal = this.setTotal.bind(this)
        this.toggle = this.toggle.bind(this)
        this.handleTaskChange = this.handleTaskChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.buildForm = this.buildForm.bind(this)
        this.setRecurring = this.setRecurring.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleAddFiled = this.handleAddFiled.bind(this)
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.updatePriceData = this.updatePriceData.bind(this)
        this.calculateTotals = this.calculateTotals.bind(this)
        this.toggleTab = this.toggleTab.bind(this)
        this.handleContactChange = this.handleContactChange.bind(this)
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
        this.handleSurcharge = this.handleSurcharge.bind(this)
        this.calculateSurcharges = this.calculateSurcharges.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.loadEntity = this.loadEntity.bind(this)

        this.total = 0
        const account_id = JSON.parse(localStorage.getItem('appState')).user.account_id
        const user_account = JSON.parse(localStorage.getItem('appState')).accounts.filter(account => account.account_id === parseInt(account_id))
        this.settings = user_account[0].account.settings
    }

    static getDerivedStateFromProps (props, state) {
        if (props.invoice && props.invoice.id && props.invoice.id !== state.id) {
            const invoiceModel = new RecurringQuoteModel(props.invoice, props.customers)
            return invoiceModel.fields
        }

        return null
    }

    componentDidMount () {
        window.addEventListener('resize', this.handleWindowSizeChange)

        if (this.props.task_id) {
            this.loadInvoice()
        }

        if (!this.props.invoice.id) {
            if (Object.prototype.hasOwnProperty.call(localStorage, 'recurringQuoteForm')) {
                const storedValues = JSON.parse(localStorage.getItem('recurringQuoteForm'))
                this.setState({ ...storedValues }, () => console.log('new state', this.state))
            }
        }

        if (this.props.invoice && this.props.invoice.customer_id) {
            const contacts = this.quoteModel.contacts
            this.setState({ contacts: contacts })
        }

        if (this.props.entity_id && this.props.entity_type) {
            this.loadEntity(this.props.entity_type)
        }
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.invoice && this.props.invoice.id && this.props.invoice.id !== prevProps.invoice.id) {
            this.quoteModel = new RecurringQuoteModel(this.props.invoice, this.state.customers)
        }
    }

    // make sure to remove the listener
    // when the component is not mounted anymore
    componentWillUnmount () {
        window.removeEventListener('resize', this.handleWindowSizeChange)
    }

    loadEntity (type) {
        const repo = (type === 'task') ? (new TaskRepository()) : ((type === 'expense') ? (new ExpenseRepository()) : (new ProjectRepository()))
        const line_type = (type === 'task') ? (consts.line_item_task) : ((type === 'expense') ? (consts.line_item_expense) : (consts.line_item_project))
        const reducer = new InvoiceReducer(this.props.entity_id, this.props.entity_type)
        repo.getById(this.props.entity_id).then(response => {
            if (!response) {
                toast.error(translations.unexpected_error, {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                })
                return
            }

            const data = reducer.build(type, response)

            this.quoteModel.customer_id = data.customer_id
            const contacts = this.quoteModel.contacts

            this.setState({
                changesMade: true,
                contacts: contacts,
                modalOpen: true,
                line_type: line_type,
                line_items: data.line_items,
                customer_id: data.customer_id
            }, () => {
                console.log(`creating new invoice for ${this.props.entity_type} ${this.props.entity_id}`)
            })

            return response
        })
    }

    hasErrorFor (field) {
        return this.state.errors && !!this.state.errors[field]
    }

    renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    toggleTab (tab) {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab })
        }
    }

    handleWindowSizeChange () {
        this.setState({ is_mobile: window.innerWidth <= 768 })
    }

    handleContactChange (e) {
        const invitations = this.quoteModel.buildInvitations(e.target.value, e.target.checked)
        // update the state with the new array of options
        this.setState({
            invitations: invitations,
            changesMade: true
        }, () => console.log('invitations', invitations))
    }

    handleInput (e) {
        const original_customer_id = this.state.customer_id
        if (e.target.name === 'customer_id') {
            const customer_data = this.quoteModel.customerChange(e.target.value)

            this.setState({
                changesMade: true,
                customerName: customer_data.name,
                contacts: customer_data.contacts,
                address: customer_data.address
            }, () => {
                this.quoteModel.customer_id = e.target.value
                localStorage.setItem('recurringQuoteForm', JSON.stringify(this.state))
            })

            if (this.settings.convert_product_currency === true) {
                const customer = new CustomerModel(customer_data.customer)
                const currency_id = customer.currencyId

                const currencies = JSON.parse(localStorage.getItem('currencies'))
                const exchange_rate = getExchangeRateWithMap(currencies, this.state.currency_id, currency_id)
                this.setState({ exchange_rate: exchange_rate, currency_id: currency_id })

                // const currency = JSON.parse(localStorage.getItem('currencies')).filter(currency => currency.id === currency_id)
                // const exchange_rate = currency[0].exchange_rate
            }

            if (this.state.project_id && original_customer_id !== parseInt(e.target.value)) {
                this.setState({ project_id: '', changesMade: true })
            }
        }

        if (e.target.name === 'tax' || e.target.name === 'tax_2' || e.target.name === 'tax_3') {
            const name = e.target.options[e.target.selectedIndex].getAttribute('data-name')
            const rate = e.target.options[e.target.selectedIndex].getAttribute('data-rate')
            const tax_rate_name = e.target.name === 'tax' ? 'tax_rate_name' : `tax_rate_name_${e.target.name.split('_')[1]}`

            this.setState({
                [e.target.name]: rate,
                [tax_rate_name]: name,
                changesMade: true
            }, () => {
                localStorage.setItem('invoiceForm', JSON.stringify(this.state))
                this.calculateTotals()
            })

            return
        }

        if (e.target.name === 'partial') {
            const has_partial = e.target.value.trim() !== ''
            this.setState({ changesMade: true, has_partial: has_partial, partial: e.target.value })
            return
        }

        if (e.target.name === 'is_amount_discount') {
            this.setState({ changesMade: true, is_amount_discount: e.target.value === 'true' })
            return
        }

        if (e.target.name === 'quote_id') {
            if (!e.target.value.length) {
                this.setState(this.initialState)
                return true
            }

            const quote = this.props.allQuotes.filter(quote => quote.id === parseInt(e.target.value))

            if (quote.length) {
                this.quoteModel.cloneQuote(quote[0])
                const initialState = this.quoteModel.fields
                initialState.contacts = this.quoteModel.contacts
                this.setState(initialState)
            }
        }

        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

        this.setState({
            changesMade: true,
            [e.target.name]: value
        }, () => localStorage.setItem('recurringQuoteForm', JSON.stringify(this.state)))
    }

    handleSurcharge (e) {
        const value = (!e.target.value) ? ('') : ((e.target.type === 'checkbox') ? (e.target.checked) : (parseFloat(e.target.value)))

        this.setState({
            changesMade: true,
            [e.target.name]: value
        }, () => this.calculateSurcharges())
    }

    calculateSurcharges (x) {
        const surcharge_totals = CalculateSurcharges({ surcharges: this.state })

        this.setState({
            changesMade: true,
            total_custom_values: surcharge_totals.total_custom_values,
            total_custom_tax: surcharge_totals.total_custom_tax
        }, () => this.calculateTotals())
    }

    handleTaskChange (e) {
        axios.get(`/api/products/tasks/${this.props.task_id}/1,2`)
            .then((r) => {
                const arrLines = []
                let total = 0

                if (r.data && r.data.line_items) {
                    r.data.line_items.map((product) => {
                        const objLine = {
                            quantity: product.quantity,
                            product_id: product.product_id,
                            unit_price: product.unit_price,
                            unit_discount: product.unit_discount,
                            unit_tax: product.unit_tax,
                            order_id: r.data.id
                        }

                        total += parseFloat(product.unit_price)
                        arrLines.push(objLine)
                    })
                }

                this.setState({
                    changesMade: true,
                    line_items: arrLines,
                    total: total
                }, () => localStorage.setItem('recurringQuoteForm', JSON.stringify(this.state)))
            })
            .catch((e) => {
                console.warn(e)
            })
    }

    loadInvoice () {
        const url = this.props.task_id ? `/api/quotes/task/${this.props.task_id}` : `/api/quote/${this.state.id}`

        axios.get(url)
            .then((r) => {
                if (r.data) {
                    this.setState({
                        changesMade: true,
                        line_items: r.data.line_items,
                        due_date: moment(r.data.due_date).format('YYYY-MM-DD'),
                        po_number: r.data.po_number,
                        invoice_id: r.data.id,
                        customer_id: r.data.customer_id,
                        user_id: r.data.user_id,
                        company_id: r.data.company_id,
                        customer_note: r.data.customer_note,
                        internal_note: r.data.internal_note,
                        terms: r.data.terms,
                        footer: r.data.footer,
                        status_id: parseInt(r.data.status_id)
                    })
                }
            })
            .catch((e) => {
                console.warn(e)
            })
    }

    toggle () {
        if (this.state.modalOpen && this.state.changesMade) {
            if (!window.confirm('Your changes have not been saved?')) {
                return false
            }
        }

        this.setState({
            modalOpen: !this.state.modalOpen,
            errors: []
        }, () => {
            if (!this.state.modalOpen && !this.state.id) {
                this.setState(this.initialState, () => localStorage.removeItem('recurringQuoteForm'))
            }
        })
    }

    updateData (rowData) {
        this.setState(prevState => ({
            line_items: [...prevState.line_items, rowData]
        }))
    }

    calculateTotals () {
        const totals = CalculateTotal({ invoice: this.state })

        this.setState({
            changesMade: true,
            total: totals.total,
            discount_total: totals.discount_total,
            tax_total: totals.tax_total,
            sub_total: totals.sub_total
        }, () => localStorage.setItem('recurringQuoteForm', JSON.stringify(this.state)))
    }

    updatePriceData (index) {
        const line_items = this.state.line_items.slice()
        line_items[index] = CalculateLineTotals({
            currentRow: line_items[index],
            settings: this.settings,
            invoice: this.state
        })

        this.setState({
            changesMade: true,
            line_items: line_items
        }, () => localStorage.setItem('recurringQuoteForm', JSON.stringify(this.state)))
    }

    handleFieldChange (line_items, row) {
        this.setState({ changesMade: true, line_items: line_items }, () => {
            this.calculateTotals()
            this.updatePriceData(row)
        })
    }

    handleAddFiled (type_id = 1) {
        this.setState((prevState, props) => {
            return {
                line_items: this.state.line_items.concat({
                    is_amount_discount: false,
                    unit_discount: 0,
                    unit_tax: 0,
                    quantity: 0,
                    unit_price: 0,
                    product_id: 0,
                    type_id: type_id
                })
            }
        })
    }

    handleDelete (idx) {
        const newTasks = this.state.line_items.filter((task, tIndex) => {
            return idx !== tIndex
        })

        this.setState({ changesMade: true, line_items: newTasks })
    }

    setTotal (total) {
        this.total = total
    }

    getFormData () {
        return {
            is_never_ending: this.state.is_never_ending,
            number_of_occurrances: this.state.number_of_occurrances,
            start_date: this.state.start_date,
            date_to_send: this.state.date_to_send,
            quote_id: this.state.quote_id,
            expiry_date: this.state.expiry_date,
            frequency: this.state.frequency,
            grace_period: this.state.grace_period,
            auto_billing_enabled: this.state.auto_billing_enabled,
            currency_id: this.state.currency_id,
            exchange_rate: this.state.exchange_rate,
            is_amount_discount: this.state.is_amount_discount,
            design_id: this.state.design_id,
            account_id: this.state.account_id,
            number: this.state.number,
            assigned_to: this.state.assigned_to,
            tax_rate: this.state.tax,
            tax_rate_name: this.state.tax_rate_name,
            tax_rate_name_2: this.state.tax_rate_name_2,
            tax_2: this.state.tax_2,
            tax_rate_name_3: this.state.tax_rate_name_3,
            tax_3: this.state.tax_3,
            is_recurring: this.state.is_recurring,
            invoice_id: this.state.id,
            task_id: this.props.task_id,
            due_date: this.state.due_date,
            customer_id: this.state.customer_id,
            company_id: this.state.company_id,
            line_items: this.state.line_items,
            total: this.state.total,
            balance: this.props.invoice && this.props.invoice.balance ? this.props.invoice.balance : this.state.total,
            po_number: this.state.po_number,
            sub_total: this.state.sub_total,
            tax_total: this.state.tax_total,
            discount_total: this.state.discount_total,
            customer_note: this.state.customer_note,
            internal_note: this.state.internal_note,
            terms: this.state.terms,
            footer: this.state.footer,
            date: this.state.date,
            partial: this.state.partial,
            partial_due_date: this.state.partial_due_date,
            recurring: this.state.recurring,
            custom_value1: this.state.custom_value1,
            custom_value2: this.state.custom_value2,
            custom_value3: this.state.custom_value3,
            custom_value4: this.state.custom_value4,
            transaction_fee: this.state.transaction_fee,
            transaction_fee_tax: this.state.transaction_fee_tax,
            shipping_cost: this.state.shipping_cost,
            shipping_cost_tax: this.state.shipping_cost_tax,
            invitations: this.state.invitations,
            gateway_fee: this.state.gateway_fee,
            gateway_percentage: this.state.gateway_percentage
        }
    }

    saveData () {
        this.setState({ loading: true })
        this.quoteModel.save(this.getFormData()).then(response => {
            if (!response) {
                this.setState({
                    loading: false,
                    showErrorMessage: true,
                    errors: this.quoteModel.errors,
                    message: this.quoteModel.error_message
                })

                toast.error(translations.updated_unsuccessfully.replace('{entity}', translations.recurring_quote), {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                })

                return
            }

            toast.success(translations.updated_successfully.replace('{entity}', translations.recurring_quote), {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            })

            if (!this.state.id) {
                const firstInvoice = response
                const allInvoices = this.props.invoices
                allInvoices.unshift(firstInvoice)
                this.props.action(allInvoices, true)
                localStorage.removeItem('recurringQuoteForm')
                localStorage.removeItem('recurringrecurringQuoteForm')
                this.setState(this.initialState)
                return
            }

            const index = this.props.invoices.findIndex(invoice => invoice.id === this.state.id)
            this.props.invoices[index] = response
            this.props.action(this.props.invoices, true)
            this.setState({ loading: false, changesMade: false, modalOpen: false })
        })
    }

    setRecurring (recurring) {
        this.setState({ recurring: recurring, changesMade: true })
    }

    reload (data) {
        this.quoteModel = new RecurringQuoteModel(data, this.state.customers)
        this.initialState = this.quoteModel.fields
        this.initialState.modalOpen = true
        this.setState(this.initialState)
    }

    buildForm () {
        const successMessage = this.state.showSuccessMessage !== false && this.state.showSuccessMessage !== ''
            ? <SuccessMessage message={this.state.showSuccessMessage}/> : null
        const errorMessage = this.state.showErrorMessage === true
            ? <ErrorMessage message={this.state.message.length > 0 ? this.state.message : 'Something went wrong'}/> : null

        const tabs = <Nav tabs className="nav-justified disable-scrollbars">
            <NavItem>
                <NavLink
                    className={this.state.activeTab === '1' ? 'active' : ''}
                    onClick={() => {
                        this.toggleTab('1')
                    }}>
                    {translations.details}
                </NavLink>
            </NavItem>

            <NavItem>
                <NavLink
                    className={this.state.activeTab === '2' ? 'active' : ''}
                    onClick={() => {
                        this.toggleTab('2')
                    }}>
                    {translations.contacts}
                </NavLink>
            </NavItem>

            <NavItem>
                <NavLink
                    className={this.state.activeTab === '3' ? 'active' : ''}
                    onClick={() => {
                        this.toggleTab('3')
                    }}>
                    {translations.items}
                </NavLink>
            </NavItem>

            <NavItem>
                <NavLink
                    className={this.state.activeTab === '4' ? 'active' : ''}
                    onClick={() => {
                        this.toggleTab('4')
                    }}>
                    {translations.notes}
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={this.state.activeTab === '5' ? 'active' : ''}
                    onClick={() => {
                        this.toggleTab('5')
                    }}>
                    {translations.documents}
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                    className={this.state.activeTab === '6' ? 'active' : ''}
                    onClick={() => {
                        this.toggleTab('6')
                    }}>
                    {translations.email}
                </NavLink>
            </NavItem>
        </Nav>

        const details = <Details show_quote={this.quoteModel.isNew} setRecurring={this.handleInput}
            handleInput={this.handleInput}
            errors={this.state.errors} hasErrorFor={this.hasErrorFor}
            renderErrorFor={this.renderErrorFor} recurring_quote={this.state}/>

        const custom = <CustomFieldsForm handleInput={this.handleInput} custom_value1={this.state.custom_value1}
            custom_value2={this.state.custom_value2}
            custom_value3={this.state.custom_value3}
            custom_value4={this.state.custom_value4}
            custom_fields={this.props.custom_fields}/>

        const contacts = this.state.is_mobile
            ? <Contactsm updateCustomers={(customers) => {
                this.setState({ customers: customers })
            }} address={this.state.address} customerName={this.state.customerName}
            handleInput={this.handleInput} invoice={this.state}
            errors={this.state.errors}
            contacts={this.state.contacts}
            invitations={this.state.invitations}
            handleContactChange={this.handleContactChange}/>
            : <Contacts updateCustomers={(customers) => {
                this.setState({ customers: customers })
            }} hide_customer={this.state.id === null} address={this.state.address}
            customerName={this.state.customerName}
            handleInput={this.handleInput} invoice={this.state} errors={this.state.errors}
            contacts={this.state.contacts} customers={this.state.customers}
            invitations={this.state.invitations} handleContactChange={this.handleContactChange}/>

        const recurring = this.state.is_mobile
            ? <Recurringm renderErrorFor={this.renderErrorFor} hasErrorFor={this.hasErrorFor}
                allQuotes={this.props.allQuotes} show_quote={this.quoteModel.isNew}
                hide_customer={this.state.id === null} address={this.state.address}
                customerName={this.state.customerName} handleInput={this.handleInput}
                customers={this.state.customers}
                errors={this.state.errors}
                recurring_quote={this.state}
            />
            : <Recurring show_quote={this.quoteModel.isNew} setRecurring={this.handleInput} handleInput={this.handleInput}
                errors={this.state.errors} hasErrorFor={this.hasErrorFor}
                renderErrorFor={this.renderErrorFor} recurring_quote={this.state}/>

        const settings = <InvoiceSettings is_mobile={this.state.is_mobile} handleSurcharge={this.handleSurcharge}
            settings={this.state}
            errors={this.state.errors} handleInput={this.handleInput}
            discount={this.state.discount}
            is_amount_discount={this.state.is_amount_discount}
            design_id={this.state.design_id}/>

        const items = <Items line_type={this.state.line_type} model={this.quoteModel} customers={this.state.customers}
            quote={this.state}
            errors={this.state.errors}
            handleFieldChange={this.handleFieldChange}
            handleAddFiled={this.handleAddFiled} setTotal={this.setTotal}
            handleDelete={this.handleDelete}
        />

        const notes = !this.state.is_mobile
            ? <NoteTabs model={this.quoteModel}
                show_exchange={this.quoteModel.account_currency.exchange_rate !== this.state.exchange_rate}
                invoice={this.state} internal_note={this.state.internal_note}
                customer_note={this.state.customer_note}
                terms={this.state.terms} footer={this.state.footer} errors={this.state.errors}
                handleInput={this.handleInput}/>
            : <Notes model={this.quoteModel} internal_note={this.state.internal_note}
                customer_note={this.state.customer_note}
                terms={this.state.terms} footer={this.state.footer} errors={this.state.errors}
                handleInput={this.handleInput}/>

        const documents = this.state.id ? <Documents invoice={this.state}/> : null

        const email_editor = this.state.id
            ? <Emails width="500" model={this.quoteModel} emails={this.state.emails} template="quote"
                show_editor={true}
                customers={this.state.customers} entity_object={this.state} entity="recurringQuote"
                entity_id={this.state.id}/> : null

        const dropdownMenu = this.state.id
            ? <DropdownMenuBuilder reload={this.reload.bind(this)} invoices={this.props.invoices}
                formData={this.getFormData()}
                model={this.quoteModel}
                handleTaskChange={this.handleTaskChange}
                action={this.props.action}/> : null

        const form = this.state.is_mobile
            ? <React.Fragment>

                {tabs}

                <TabContent activeTab={this.state.activeTab} className="bg-transparent">
                    <TabPane tabId="1">
                        {recurring}
                        {custom}
                    </TabPane>

                    <TabPane tabId="2">
                        {contacts}
                    </TabPane>

                    <TabPane tabId="3">
                        {settings}
                        {items}
                    </TabPane>

                    <TabPane tabId="4">
                        {notes}
                    </TabPane>

                    <TabPane tabId="5">
                        {documents}
                    </TabPane>

                    <TabPane tabId="6">
                        {email_editor}
                    </TabPane>
                </TabContent>
            </React.Fragment>

            : <React.Fragment>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={this.state.activeTab === '1' ? 'active' : ''}
                            onClick={() => {
                                this.toggleTab('1')
                            }}>
                            {translations.quote}
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={this.state.activeTab === '2' ? 'active' : ''}
                            onClick={() => {
                                this.toggleTab('2')
                            }}>
                            {translations.email}
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={this.state.activeTab === '3' ? 'active' : ''}
                            onClick={() => {
                                this.toggleTab('3')
                            }}>
                            {translations.documents}
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={this.state.activeTab} className="bg-transparent">
                    <TabPane tabId="1">
                        <Row form>
                            <Col md={4}>
                                {recurring}
                                {custom}
                            </Col>

                            <Col md={4}>
                                {details}
                                {contacts}
                            </Col>

                            <Col md={4}>
                                {settings}
                            </Col>
                        </Row>
                        {items}

                        <Row form>
                            <Col md={8}>
                                {notes}
                            </Col>

                            <Col md={3} className="m-3">
                                <TotalsBox settings={this.settings} invoice={this.state}/>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tabId="2">
                        {email_editor}
                    </TabPane>

                    <TabPane tabId="3">
                        {documents}
                    </TabPane>
                </TabContent>
            </React.Fragment>

        return (
            <div>
                {dropdownMenu}
                {successMessage}
                {errorMessage}
                {form}

            </div>
        )
    }

    render () {
        const form = this.buildForm()
        const { success, loading } = this.state
        const button = this.props.add === true ? <AddButtons toggle={this.toggle}/>
            : <DropdownItem onClick={this.toggle}><i className={`fa ${icons.edit}`}/>{translations.edit_recurring_quote}
            </DropdownItem>
        const theme = !Object.prototype.hasOwnProperty.call(localStorage, 'dark_theme') || (localStorage.getItem('dark_theme') && localStorage.getItem('dark_theme') === 'true') ? 'dark-theme' : 'light-theme'

        if (this.props.modal) {
            return (
                <React.Fragment>
                    {button}
                    <Modal isOpen={this.state.modalOpen} toggle={this.toggle} className={this.props.className}
                        size="lg">
                        <DefaultModalHeader toggle={this.toggle}
                            title={this.quoteModel.isNew ? translations.add_recurring_quote : translations.edit_recurring_quote}/>

                        <ModalBody className={theme}>
                            <ToastContainer
                                position="top-center"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                            />

                            {form}
                        </ModalBody>
                        <DefaultModalFooter show_success={true} toggle={this.toggle} saveData={this.saveData}
                            loading={loading}/>
                    </Modal>
                </React.Fragment>
            )
        }

        return (
            <div>

                {success && <div className="alert alert-success" role="alert">
                    Products added to task successfully
                </div>}

                {form}
                <Button color="success" onClick={this.saveData}>{translations.save}</Button>
            </div>
        )
    }
}

export default UpdateRecurringQuote
