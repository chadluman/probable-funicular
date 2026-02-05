let contacts = [
     {
    name: "Maxwell Wright",
    phone: "(0191) 719 6495",
    email: "Curabitur.egestas.nunc@nonummyac.co.uk"
    },
    {
    name: "Raja Villarreal",
    phone: "0866 398 2895",
    email: "posuere.vulputate@sed.com"
    },
    {
    name: "Helen Richards",
    phone: "0800 1111",
    email: "libero@convallis.edu"
    }];

function showContact(contactList, index) {
  if (!(contactList instanceof Array)) {
    console.error("First argument must be an array");
    return;
  }

  if (typeof index !== "number" || index < 0 || index >= contactList.length) {
    console.error("Invalid contact index");
    return;
  }

  const contact = contactList[index];
  console.log(`Name: ${contact.name}`);
  console.log(`Phone: ${contact.phone}`);
  console.log(`Email: ${contact.email}`);
}

function addNewContact(contactList, name, phone, email) {
  if (!(contactList instanceof Array)) {
    console.error("First argument must be an array");
    return;
  }

  if (!name || !phone || !email) {
    console.error("All contact fields must have values");
    return;
  }

  contactList.push({
    name: name,
    phone: phone,
    email: email
  });
}



//showContact: the function should take two arguments; the first is the list of contacts, and the second is the index number of the contact to display; inside the function, check if the correct arguments are passed, that is, if the contacts are an array (use the instanceofArray construction for this);

//is contacts and array (instance of array)



//showAllContacts: the function should take one argument, the list of contacts; inside the function, check if the given argument is an array;
//addNewContact: the function should take four arguments, a contact list and the data of the new contact, that is: name, phone, and number; before adding a new contact, check if the passed argument is an array and if the new contact data have any value.
 
 