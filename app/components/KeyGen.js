import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import {
  Grid,
  Paper,
  TextField,
  Box,
  Typography,
  Button,
  Stack,
  LoadingButton,
  Switch,
  Chip,
  Link,
} from "@mui/material";
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

  const [prefix, setPrefix] = useState("");
  const handleChangePrefix = (event) => {
    setPrefix(event.target.value);
  };

  const [addressesGenerated, setAddressesGenerated] = useState(0);
  const [loading, setLoading] = useState("false");

  const VanityPairSlow = async () => {
    let svk = generatePrivateKey();
    let pvk = getPublicKey(svk);
    let i = 0;
    while (pvk.substring(0, prefix.length) !== prefix) {
      svk = generatePrivateKey();
      pvk = getPublicKey(svk);
      i++;
      setLoading("true");
      setAddressesGenerated(i);
      await new Promise((r) => setTimeout(r, 1));
    }
    setLoading("false");
    setPrivateKey(svk);
    setPublicKey(pvk);
    setAddressesGenerated(i);
  };
  const VanityPair = async () => {
    let svk = generatePrivateKey();
    let pvk = getPublicKey(svk);
    let i = 0;
    while (pvk.substring(0, prefix.length) !== prefix) {
      svk = generatePrivateKey();
      pvk = getPublicKey(svk);
      i++;
      setLoading("true");
      setAddressesGenerated(i);
    }
    setLoading("false");
    setPrivateKey(svk);
    setPublicKey(pvk);
    setAddressesGenerated(i);
  };

  const [checked, setChecked] = React.useState(true);
  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="h4">Vanity KeyGen</Typography>
                <Typography>
                  Generation happens locally in your browser. You can disconnect
                  from the internet before running and close the window before
                  reconecting.
                </Typography>
                <Typography>
                  Source code is public and available on github at the link
                  below
                </Typography>
                <Link>
                  <a target={"_blank"} href={"https://github.com/"}>
                    <Typography> Link to github</Typography>
                  </a>
                </Link>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Stack direction={"row"} spacing={2} alignItems="center">
                  <Switch
                    checked={checked}
                    onChange={handleChangeChecked}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <Chip label={"currently in"} />
                  {checked ? (
                    <Chip color={"success"} label={"Slow Mode"} />
                  ) : (
                    <Chip color={"warning"} label={"Fast Mode"} />
                  )}
                </Stack>
                <Paper sx={{ p: 2, m: 2 }}>
                  <Typography>
                    Slow mode will add a slight delay between each address
                    generation. Use this mode if you are generating over a long
                    period of time. When this mode is off addresses will be
                    generated as fast as possible which will be very resource
                    intense.
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, m: 2 }}>
                  <Typography>
                    * note * Anything more than 6 characters could take hours
                  </Typography>
                </Paper>
                <Stack direction="column" spacing={2}>
                  <Chip
                    color="warning"
                    label="Your prefix must be hex, so is only able to have the following characters: 0123456789abcdef"
                  />
                  <TextField
                    id="outlined-basic"
                    label="Prefix"
                    variant="outlined"
                    value={prefix}
                    onChange={handleChangePrefix}
                  />
                  {loading === "true" ? (
                    <Button variant="contained" disabled>
                      Loading
                    </Button>
                  ) : checked ? (
                    <Button
                      variant="contained"
                      onClick={VanityPairSlow}
                      loading={loading}
                    >
                      Generate Vanity Address Slow
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={VanityPair}
                      loading={loading}
                      color="warning"
                    >
                      Generate Vanity Address
                    </Button>
                  )}
                  {checked ? (
                    addressesGenerated > 0 && (
                      <Typography>
                        Generated {addressesGenerated} addresses before pair was
                        found
                      </Typography>
                    )
                  ) : (
                    <Typography>
                      Counter does not appear until complete on fast mode
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              <Box sx={{ p: 2 }}>
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
