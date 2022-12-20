import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { Grid, Paper, TextField, Box, Typography, Button } from "@mui/material";
import { generatePrivateKey, getPublicKey } from "nostr-tools";

export default function KeyGen() {
  const [privateKey, setPrivateKey] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("");

  const GeneratePair = () => {
    let sk = generatePrivateKey();
    setPrivateKey(sk);
    let pk = getPublicKey(sk);
    setPublicKey(pk);
  };

  useEffect(() => {
    GeneratePair();
  }, []);

  return (
    <div>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="h4">KeyGen</Typography>
                <Button variant="contained" onClick={GeneratePair}>
                  Generate
                </Button>
                <Typography variant="h6">Public Key</Typography>
                {publicKey}
                <Typography variant="h6">Private Key</Typography>
                {privateKey}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
