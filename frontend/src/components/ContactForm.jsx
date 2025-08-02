import React, { useState } from 'react';
import Dialog from '../pages/Dialog';
import Button from '../pages/Button';
import Input from '../pages/Input';
import Textarea from '../pages/Textarea';
import Label from '../pages/Label';

function ContactForm() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)}>
        Open Contact Form
      </Button>

      <Dialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        title="Contact Us"
      >
        <Label>Name</Label>
        <Input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />

        <Label className="mt-4">Message</Label>
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Message"
        />

        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
          >
            Send
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default ContactForm;