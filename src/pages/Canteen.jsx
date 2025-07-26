import React, { useState } from 'react';
import './Canteen.css';

const mockMenu = [
  {
    id: 1,
    name: 'Chicken Biryani',
    price: 120,
    category: 'Main Course',
    available: true,
    description: 'Spicy chicken biryani with raita'
  },
  {
    id: 2,
    name: 'Veg Fried Rice',
    price: 80,
    category: 'Main Course',
    available: true,
    description: 'Mixed vegetable fried rice'
  },
  {
    id: 3,
    name: 'Chicken Curry',
    price: 100,
    category: 'Main Course',
    available: true,
    description: 'Spicy chicken curry with rice'
  },
  {
    id: 4,
    name: 'Tea',
    price: 15,
    category: 'Beverages',
    available: true,
    description: 'Hot masala tea'
  },
  {
    id: 5,
    name: 'Coffee',
    price: 20,
    category: 'Beverages',
    available: true,
    description: 'Filter coffee'
  },
  {
    id: 6,
    name: 'Samosa',
    price: 25,
    category: 'Snacks',
    available: true,
    description: 'Crispy potato samosa'
  }
];

const Canteen = () => {
  const [role, setRole] = useState('student');
  const [menu, setMenu] = useState(mockMenu);
  const [cart, setCart] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: ''
  });

  const categories = ['Main Course', 'Beverages', 'Snacks', 'Desserts'];

  // Generate unique booking ID
  const generateBookingId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CANT${timestamp}${random}`;
  };

  // Generate unique order ID
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD${timestamp}${random}`;
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const generateBill = () => {
    const bookingId = generateBookingId();
    const orderId = generateOrderId();
    const currentTime = new Date();
    
    const order = {
      bookingId,
      orderId,
      items: [...cart],
      totalAmount: getTotalAmount(),
      orderTime: currentTime,
      status: 'pending',
      studentInfo: {
        name: 'John Doe', // Mock student info - in real app, get from user context
        rollNo: '21CSE001',
        dept: 'CSE'
      }
    };

    // Add order to orders list
    setOrders([order, ...orders]);

    const billContent = `
      SRI ESHWAR COLLEGE OF ENGINEERING
      CANTEEN BILL
      
      Booking ID: ${bookingId}
      Order ID: ${orderId}
      Date: ${currentTime.toLocaleDateString()}
      Time: ${currentTime.toLocaleTimeString()}
      
      Student Details:
      Name: ${order.studentInfo.name}
      Roll No: ${order.studentInfo.rollNo}
      Department: ${order.studentInfo.dept}
      
      ITEMS:
      ${cart.map(item => 
        `${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
      ).join('\n')}
      
      TOTAL: ₹${getTotalAmount()}
      
      Status: ${order.status.toUpperCase()}
      
      This is a unique bill. Please present this ID at the counter.
      Thank you for your order!
    `;

    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canteen-bill-${bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Clear cart after successful order
    setCart([]);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category,
      description: newItem.description,
      available: true
    };
    setMenu([...menu, item]);
    setNewItem({ name: '', price: '', category: 'Main Course', description: '' });
    setShowAddForm(false);
  };

  const toggleAvailability = (itemId) => {
    setMenu(menu.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="canteen-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Canteen Prebook</h2>
        <button className="btn btn-secondary" onClick={() => setRole(role === 'student' ? 'admin' : 'student')}>
          Switch to {role === 'student' ? 'Admin' : 'Student'} View
        </button>
      </div>

      {role === 'admin' ? (
        <div className="admin-canteen">
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            Add Menu Item
          </button>

          {showAddForm && (
            <div className="add-item-form">
              <h3>Add New Menu Item</h3>
              <form onSubmit={handleAddItem}>
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="menu-management">
            <h3>Today's Menu</h3>
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="menu-category">
                <h4>{category}</h4>
                <div className="menu-items">
                  {items.map(item => (
                    <div key={item.id} className={`menu-item ${!item.available ? 'unavailable' : ''}`}>
                      <div className="item-info">
                        <h5>{item.name}</h5>
                        <p>{item.description}</p>
                        <span className="price">₹{item.price}</span>
                      </div>
                      <button
                        className={`btn ${item.available ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => toggleAvailability(item.id)}
                      >
                        {item.available ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="orders-section">
            <h3>Recent Orders</h3>
            {orders.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.orderId} className="order-card">
                    <div className="order-header">
                      <h4>Order #{order.orderId}</h4>
                      <span className={`status ${order.status}`}>{order.status}</span>
                    </div>
                    <div className="order-details">
                      <p><strong>Booking ID:</strong> {order.bookingId}</p>
                      <p><strong>Student:</strong> {order.studentInfo.name} ({order.studentInfo.rollNo})</p>
                      <p><strong>Time:</strong> {order.orderTime.toLocaleString()}</p>
                      <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                    </div>
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item">
                          {item.name} x{item.quantity} = ₹{item.price * item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="student-canteen">
          <div className="menu-section">
            <h3>Today's Menu</h3>
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="menu-category">
                <h4>{category}</h4>
                <div className="menu-items">
                  {items.filter(item => item.available).map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="item-info">
                        <h5>{item.name}</h5>
                        <p>{item.description}</p>
                        <span className="price">₹{item.price}</span>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-section">
            <h3>Your Order</h3>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-details">
                        <h5>{item.name}</h5>
                        <span>₹{item.price} each</span>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="item-total">
                        ₹{item.price * item.quantity}
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <h4>Total: ₹{getTotalAmount()}</h4>
                  <button className="btn btn-primary" onClick={generateBill}>
                    Generate Bill & Download
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Canteen; 