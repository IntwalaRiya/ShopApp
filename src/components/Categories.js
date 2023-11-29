import React, { useEffect } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../redux/actions/category-actions/fetchCategoriesAction";
import { Link } from "react-router-dom";

function Categories() {
  const { categories, loading } = useSelector(state => state.categoriesss);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Container>
      <Table striped bordered hover variant='dark'>
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan='2'>
                <Spinner animation='border' /> loading...{" "}
              </td>
            </tr>
          )}
          {categories && categories.length > 0 ? (categories.map((category)=> (
              <tr key={category.CategoryID}>
                <td>
                  <Link to={`/category/${category.CategoryID}`}>{category.Name}</Link>
                </td>
                <td>{category.Description}</td>
              </tr>
            ))
          ):(
            <p>No Categories available.</p>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default Categories;
