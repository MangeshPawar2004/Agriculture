import React from "react";
import { SignUp } from "@clerk/clerk-react";
import styled from "styled-components";

const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LeftSection = styled.div`
  flex: 1;
  background: url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80");
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  text-align: center;
  position: relative;
  z-index: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const AuthBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Auth = () => {
  return (
    <AuthContainer>
      <LeftSection>
        <Title>Welcome to Krishi Mitra</Title>
      </LeftSection>
      <RightSection>
        <AuthBox>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                },
                card: {
                  boxShadow: "none",
                },
              },
            }}
          />
        </AuthBox>
      </RightSection>
    </AuthContainer>
  );
};

export default Auth;
