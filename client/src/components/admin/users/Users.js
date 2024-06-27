import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReservations, setFilteredReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/reservations');
                setReservations(response.data);
                setFilteredReservations(response.data); // Initialize filtered reservations with all reservations
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, []);

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterReservations(e.target.value); // Call filter function whenever search term changes
    };

    // Function to filter reservations by userDisplayName
    const filterReservations = (term) => {
        if (!term.trim()) {
            setFilteredReservations(reservations); // Reset to all reservations if search term is empty
        } else {
            const filtered = reservations.filter(reservation =>
                reservation.userDisplayName.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredReservations(filtered);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Reservations</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by User Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">Product Name</th>
                            <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">User Name</th>
                            <th className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">Reserved At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReservations.map((reservation, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">{reservation.productNameTxt}</td>
                                <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">{reservation.userDisplayName}</td>
                                <td className="py-3 px-4 border-b border-gray-300 dark:border-gray-600">{new Date(reservation.reservedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
