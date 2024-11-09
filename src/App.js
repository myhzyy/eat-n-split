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
  const [buttonOpen, setButtonOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  console.log(selectedFriend);

  function switchOnOff() {
    setButtonOpen((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setButtonOpen(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />
        {buttonOpen && <Form onAddFriend={handleAddFriend} />}
        <Button onClick={switchOnOff}>{buttonOpen ? "Close" : "Open"}</Button>
      </div>
      {selectedFriend && (
        <SplitBill
          paying={setWhoIsPaying}
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friends={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function Friend({ friends, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friends.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friends.image} alt={friends.name} />
      <h3>{friends.name}</h3>

      {friends.balance < 0 && (
        <p className="red">You owe {Math.abs(friends.balance)}</p>
      )}

      {friends.balance > 0 && (
        <p className="green">
          {friends.name} owes you {friends.balance}
        </p>
      )}

      {friends.balance === 0 && <p>You and {friends.name} are even</p>}

      <Button onClick={() => onSelection(friends)}>
        {isSelected ? "Close" : "Open"}
      </Button>
    </li>
  );
}

function Form({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label>Image URL</label>
      <input
        type="text"
        onChange={(e) => setImage(e.target.value)}
        value={image}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  /// if the whoIsPaying tab, is set to user, then this is
  /// you paying

  /// if it's the opposite, then its your friend paying
  /// so its's the paidbyUser, but made -

  /// negative numbers mean you OWE the value
  /// posotive numbers mean friend owes you]

  /// if you are paying, you want a positive number as they are paying you

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>

      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>{selectedFriend.name} expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Add</Button>
    </form>
  );
}
