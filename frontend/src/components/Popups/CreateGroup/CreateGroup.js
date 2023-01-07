import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import Form from 'react-bootstrap/Form';

export default function CreateGroup() {
    const [open, setOpen] = React.useState(false);

    //Handling ynimic forms
    const [formFields, setFormFields] = React.useState([
        {
            email: ""
        }
    ]);

    const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value.toLowerCase();
        setFormFields(data);
    }

    const addFields = () => {
        let obj = {
            email: ""
        }
        setFormFields([...formFields, obj]);
    }
    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1);
        setFormFields(data);
    }



    const handleCreateGrpupChat = async () => {
        window.alert("Create Individual chat");
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <AddIcon onClick={handleClickOpen} />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Send Direct message to"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Form>
                            {formFields.map((form, index) => {
                                return (
                                    <div className='row mx-2 my-2'>
                                        <div class="col">
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email" placeholder="Enter email"  name="email" onChange={ event => handleFormChange(event,index)} />
                                            </Form.Group>
                                        </div>
                                        <div class="col my-auto">
                                            <button className="btn btn-danger btn-sm" onClick={() => removeFields(index)} >Remove</button>
                                        </div>
                                    </div>
                                )
                            })}
                            <button className="btn btn-outline-secondary mx-6" onClick={addFields}>Add More</button>
                        </Form>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleCreateGrpupChat} autoFocus>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
