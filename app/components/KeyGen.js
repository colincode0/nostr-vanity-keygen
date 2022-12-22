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
  Divider,
  Tooltip,
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
    setAddressesGenerated(0);
    let svk = generatePrivateKey();
    let pvk = getPublicKey(svk);
    let i = 0;
    while (pvk.substring(0, prefix.length) !== prefix) {
      svk = generatePrivateKey();
      pvk = getPublicKey(svk);
      i++;
      setLoading("true");
      if (i % 100 === 0) {
        setAddressesGenerated(i);
      }
      await new Promise((r) => setTimeout(r, 0.01));
    }
    setLoading("false");
    setPrivateKey(svk);
    setPublicKey(pvk);
    setAddressesGenerated(i);
  };
  const VanityPair = async () => {
    setAddressesGenerated(0);
    let svk = generatePrivateKey();
    let pvk = getPublicKey(svk);
    let i = 0;
    while (pvk.substring(0, prefix.length) !== prefix) {
      svk = generatePrivateKey();
      pvk = getPublicKey(svk);
      i++;
      setLoading("true");
    }
    setLoading("false");
    setPrivateKey(svk);
    setPublicKey(pvk);
    setAddressesGenerated(i);
  };

  const [checked, setChecked] = React.useState(true);
  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
    setAddressesGenerated(0);
  };

  return (
    <div>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className="paperCard">
              <Box sx={{ p: 2 }}>
                <Typography variant="h4">Vanity KeyGen</Typography>
                <PaddedDivider />
                <Typography>
                  Generation happens locally in your browser. You can disconnect
                  from the internet before running, and make sure to close the
                  window after generation before reconnecting to the internet.
                </Typography>
                <PaddedDivider />
                <Typography>
                  The source code is public and available on github at the link
                  below
                </Typography>
                <Link href={"https://github.com/"}>
                  <Typography> Link to github</Typography>
                </Link>
                {/* <PaddedDivider />
                <Typography>My current nostr: </Typography> */}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className="paperCard">
              <Box sx={{ p: 2 }}>
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems="center"
                  sx={{ p: 2 }}
                >
                  <Switch
                    checked={checked}
                    onChange={handleChangeChecked}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  {checked ? (
                    <Chip color={"success"} label={"Currently In Slow Mode"} />
                  ) : (
                    <Chip color={"error"} label={"Currently In Fast Mode"} />
                  )}
                </Stack>
                <Paper sx={{ p: 2, m: 2 }} className="paperCard">
                  <Typography>
                    Slow mode will add a slight delay between each address
                    generation. Use this mode if you are generating over a long
                    period of time or don't have good hardware. When this mode
                    is off addresses will be generated as fast as possible which
                    will be very resource intense. Fast mode can potentially
                    crash your browser.
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, m: 2 }} className="paperCard">
                  <Typography>
                    I do not recommend trying for more than 6 characters. The
                    prefix will get exponentially more difficult for each
                    character added.
                  </Typography>
                </Paper>
                <Stack direction="column" spacing={2}>
                  <Chip
                    color="warning"
                    label="Your prefix must be hex, so you can only use the following characters: 0123456789abcdef"
                  />
                  <Paper className="paperText" sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      id="outlined-basic"
                      label="Prefix"
                      variant="outlined"
                      value={prefix}
                      onChange={handleChangePrefix}
                    />
                  </Paper>
                  {loading === "true" ? (
                    <Chip label="Generating..." color="warning" />
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
                  {checked
                    ? addressesGenerated > 0 && (
                        <Typography>
                          Generated {addressesGenerated} addresses before pair
                          was found
                        </Typography>
                      )
                    : addressesGenerated > 0 && (
                        <>
                          <Typography>
                            Counter does not appear until the end on fast mode
                          </Typography>
                          <Typography>
                            Generated {addressesGenerated} addresses before pair
                            was found
                          </Typography>
                        </>
                      )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className="paperCard">
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

function PaddedDivider() {
  return (
    <Box sx={{ py: 1 }}>
      <Divider />
    </Box>
  );
}
