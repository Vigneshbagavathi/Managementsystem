import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table, Button, Input, Pagination } from "antd";

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8088/api/branches", {
        params: { page: page - 1, size: 10, sortBy: "id" },
      });
      setBranches(response.data.content);
      setTotal(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches, searchTerm]); // 'fetchBranches' is now stable due to useCallback

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8088/api/branches/${id}`);
      fetchBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Manager", dataIndex: "manager", key: "manager" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Branch Management</h1>
      <Input.Search
        placeholder="Search branches"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <Table
        dataSource={branches}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={page}
        total={total}
        pageSize={10}
        onChange={(p) => setPage(p)}
        style={{ marginTop: 20, textAlign: "center" }}
      />
    </div>
  );
};

export default BranchManagement;
