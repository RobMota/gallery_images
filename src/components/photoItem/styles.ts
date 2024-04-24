import styled from "styled-components";

export const Container = styled.div`
  background-color: #3d3f43;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 10px;

  img {
    border-radius: 10px;
    max-width: 100%;
    margin-bottom: auto;
  }

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 23ch;
  }
`;
