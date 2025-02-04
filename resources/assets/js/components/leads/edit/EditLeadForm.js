import React from 'react'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    DropdownItem,
    Modal,
    ModalBody,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap'
import axios from 'axios'
import LeadModel from '../../models/LeadModel'
import Contact from './Contact'
import Address from './Address'
import Details from './Details'
import Notes from '../../common/Notes'
import Emails from '../../emails/Emails'
import { icons } from '../../utils/_icons'
import { translations } from '../../utils/_translations'
import DefaultModalHeader from '../../common/ModalHeader'
import DefaultModalFooter from '../../common/ModalFooter'
import FileUploads from '../../documents/FileUploads'
import DropdownMenuBuilder from '../../common/DropdownMenuBuilder'
import CustomFieldsForm from '../../common/CustomFieldsForm'
import { toast, ToastContainer } from 'react-toastify'

class EditLeadForm extends React.Component {
    constructor (props) {
        super(props)

        this.leadModel = new LeadModel(this.props.lead)
        this.initialState = this.leadModel.fields
        this.state = this.initialState

        this.toggle = this.toggle.bind(this)
        this.toggleTab = this.toggleTab.bind(this)
        this.handleInputChanges = this.handleInputChanges.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.convertLead = this.convertLead.bind(this)
    }

    static getDerivedStateFromProps (props, state) {
        if (props.lead && props.lead.id !== state.id) {
            const leadModel = new LeadModel(props.lead)
            return leadModel.fields
        }

        return null
    }

    componentDidMount () {
        this.getSourceTypes()
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.lead && this.props.lead.id !== prevProps.lead.id) {
            this.leadModel = new LeadModel(this.props.lead)
        }
    }

    toggleTab (tab) {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab })
        }
    }

    convertLead () {
        axios.get(`/api/lead/convert/${this.state.id}`)
            .then(function (response) {
                const arrTasks = [...this.props.allTasks]
                const index = arrTasks.findIndex(task => task.id === this.props.task.id)
                arrTasks.splice(index, 1)
                this.props.action(arrTasks, true)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    handleInputChanges (e) {
        this.setState({
            [e.target.name]: e.target.value,
            changesMade: true
        })
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

    getFormData () {
        return {
            project_id: this.state.project_id,
            customer_note: this.state.customer_note,
            internal_note: this.state.internal_note,
            custom_value1: this.state.custom_value1,
            custom_value2: this.state.custom_value2,
            custom_value3: this.state.custom_value3,
            custom_value4: this.state.custom_value4,
            website: this.state.website,
            industry_id: this.state.industry_id,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            phone: this.state.phone,
            address_1: this.state.address_1,
            address_2: this.state.address_2,
            zip: this.state.zip,
            city: this.state.city,
            job_title: this.state.job_title,
            company_name: this.state.company_name,
            description: this.state.description,
            name: this.state.name,
            valued_at: this.state.valued_at,
            assigned_to: this.state.assigned_to,
            source_type: this.state.source_type,
            task_type: this.props.task_type,
            task_status_id: this.state.task_status_id,
            column_color: this.state.column_color
        }
    }

    handleClick (event) {
        this.setState({ loading: true })
        const formData = this.getFormData()

        this.leadModel.save(formData).then(response => {
            if (!response) {
                this.setState({ errors: this.leadModel.errors, message: this.leadModel.error_message })

                toast.error(translations.updated_unsuccessfully.replace('{entity}', translations.lead), {
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

            toast.success(translations.updated_successfully.replace('{entity}', translations.deal), {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            })

            const index = this.props.allTasks.findIndex(lead => lead.id === this.props.lead.id)
            this.props.allTasks[index] = response
            this.props.action(this.props.allTasks, true)
            this.setState({
                editMode: false,
                changesMade: false
            })
            this.toggle()
        })
    }

    toggle () {
        if (this.state.modal && this.state.changesMade) {
            if (window.confirm('Your changes have not been saved?')) {
                this.setState({ ...this.initialState })
            }

            return
        }

        this.setState({
            modal: !this.state.modal
        })
    }

    getSourceTypes () {
        axios.get('/api/tasks/source-types')
            .then((r) => {
                this.setState({
                    sourceTypes: r.data,
                    err: ''
                })
            })
            .then((r) => {
                console.warn(this.state.users)
            })
            .catch((e) => {
                console.error(e)
                this.setState({
                    err: e
                })
            })
    }

    render () {
        const { loading } = this.state
        const email_editor = this.state.id
            ? <Emails model={this.leadModel} emails={this.state.emails} template="email_template_lead"
                show_editor={true}
                entity_object={this.state} entity="lead"
                entity_id={this.state.id}/> : null
        const contact = <Contact handleInputChanges={this.handleInputChanges} errors={this.state.errors}
            lead={this.state}/>
        const address = <Address handleInputChanges={this.handleInputChanges} errors={this.state.errors}
            lead={this.state}/>
        const details = <Details users={this.props.users} sourceTypes={this.state.sourceTypes}
            handleInputChanges={this.handleInputChanges} errors={this.state.errors}
            lead={this.state}/>

        const custom_fields = <CustomFieldsForm handleInput={this.handleInputChanges}
            custom_value1={this.state.custom_value1}
            custom_value2={this.state.custom_value2}
            custom_value3={this.state.custom_value3}
            custom_value4={this.state.custom_value4}
            custom_fields={this.props.custom_fields}/>

        let button = this.props.listView && this.props.listView === true
            ? <DropdownItem onClick={this.toggle}><i className={`fa ${icons.edit}`}/>{translations.edit_lead}
            </DropdownItem>
            : <Button className="mr-2 ml-2" color="primary" onClick={this.toggle}>Edit Lead</Button>

        if (this.props.show_as_link === true) {
            button = <Button className="text-white" color="link" onClick={this.toggle}>{translations.edit_task}</Button>
        }

        const notes = <Notes handleInput={this.handleInputChanges} internal_note={this.state.internal_note}
            customer_note={this.state.customer_note}/>
        const theme = !Object.prototype.hasOwnProperty.call(localStorage, 'dark_theme') || (localStorage.getItem('dark_theme') && localStorage.getItem('dark_theme') === 'true') ? 'dark-theme' : 'light-theme'

        return (
            <React.Fragment>
                {button}
                <Modal size="lg" isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <DefaultModalHeader toggle={this.toggle} title={translations.edit_lead}/>

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

                        <React.Fragment>
                            <Nav tabs>
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
                                        {translations.contact}
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink
                                        className={this.state.activeTab === '3' ? 'active' : ''}
                                        onClick={() => {
                                            this.toggleTab('3')
                                        }}>
                                        {translations.address}
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
                                        {translations.email}
                                    </NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink
                                        className={this.state.activeTab === '6' ? 'active' : ''}
                                        onClick={() => {
                                            this.toggleTab('6')
                                        }}>
                                        {translations.documents}
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <DropdownMenuBuilder invoices={this.state} formData={this.getFormData()}
                                        model={this.leadModel}
                                        action={this.props.action}/>
                                    {details}
                                    {custom_fields}
                                </TabPane>

                                <TabPane tabId="2">
                                    {contact}
                                </TabPane>

                                <TabPane tabId="3">
                                    {address}
                                </TabPane>

                                <TabPane tabId="4">
                                    {notes}
                                </TabPane>

                                <TabPane tabId="5">
                                    {email_editor}
                                </TabPane>

                                <TabPane tabId="6">
                                    <Card>
                                        <CardHeader>{translations.documents}</CardHeader>
                                        <CardBody>
                                            <FileUploads entity_type="Lead" entity={this.state}
                                                user_id={this.state.user_id}/>
                                        </CardBody>
                                    </Card>
                                </TabPane>
                            </TabContent>
                        </React.Fragment>
                    </ModalBody>

                    <DefaultModalFooter show_success={true} toggle={this.toggle}
                        saveData={this.handleClick.bind(this)}
                        extra_button={<Button color="success"
                            onClick={this.convertLead}>{translations.convert_lead}</Button>
                        } loading={loading}/>
                </Modal>
            </React.Fragment>
        )
    }
}

export default EditLeadForm
