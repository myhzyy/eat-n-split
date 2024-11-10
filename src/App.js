import { Children, useCallback, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [formOpen, setFormOpen] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  ///// STATES ^^

  //////////////////// FUNCTIONS

  function handleForm() {
    setFormOpen((form) => !form);
  }

  function handleUpdateForm(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    setSelectedFriend(friend);
    console.log(friend);
  }

  ///////////////////////

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onSelection={handleSelection} />
        {formOpen && <InputForm handleUpdateForm={handleUpdateForm} />}
        <Button handleForm={handleForm}>{formOpen ? "Close" : "Open"}</Button>
      </div>

      {selectedFriend && <BillForm />}
    </div>
  );
}

function FriendsList({ friends, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friends friend={friend} key={friend.name} onSelection={onSelection} />
      ))}
    </ul>
  );
}

function Friends({ friend, onSelection }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} £{friend.balance}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you £{friend.balance}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <button className="button" onClick={() => onSelection(friend)}>
        Close
      </button>
    </li>
  );
}

function InputForm({ handleUpdateForm }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?");

  function handleForm(e) {
    e.preventDefault(e);

    const id = crypto.randomUUID();

    const newFriend = {
      name,
      image,
      balance: 0,
      id: `${image}?=${id}`,
    };

    handleUpdateForm(newFriend);

    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleForm}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function Button({ children, handleForm }) {
  return (
    <button className="button" onClick={handleForm}>
      {children}
    </button>
  );
}

function BillForm() {
  const [billValue, setBillValue] = useState("");
  const [expense, setExpense] = useState("");
  const paidByFriend = billValue ? billValue - expense : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  return (
    <form className="form-split-bill">
      <h2>Split a bill with x</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />
      <label>Your expense</label>
      <input
        type="text"
        value={expense}
        onChange={(e) =>
          setExpense(
            Number(e.target.value) > billValue
              ? expense
              : Number(e.target.value)
          )
        }
      />

      <label>Sarah's expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">Friend</option>
      </select>
    </form>
  );
}

/// TO DO

/// HIGHLIGHT FRIEND AND ADD CLASS WHEN CLICKED
