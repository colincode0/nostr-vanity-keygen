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
  Dialog,
  Modal,
} from "@mui/material";
import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { Black_And_White_Picture } from "@next/font/google";

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

  const [prefix, setPrefix] = useState("be");
  const handleChangePrefix = (event) => {
    setPrefix(event.target.value);
    setDoneGenerating(false);
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
        await new Promise((r) => setTimeout(r, 1));
      }
    }
    setLoading("false");
    setPrivateKey(svk);
    setPublicKey(pvk);
    setAddressesGenerated(i);
    setDoneGenerating(true);
  };
  const VanityPair = async () => {
    setLoading("true");
    setAddressesGenerated(0);
    let svk = generatePrivateKey();
    let pvk = getPublicKey(svk);
    let i = 0;
    while (pvk.substring(0, prefix.length) !== prefix) {
      svk = generatePrivateKey();
      pvk = getPublicKey(svk);
      i++;
      if (i % 3000 === 0) {
        await new Promise((r) => setTimeout(r, 0.01));
        setAddressesGenerated(i);
      }
    }
    setLoading("false");
    setPrivateKey(svk);
    setPublicKey(pvk);
    setAddressesGenerated(i);
    setDoneGenerating(true);
  };

  const [checked, setChecked] = React.useState(true);
  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
    setAddressesGenerated(0);
    setDoneGenerating(false);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [highlight, setHighlight] = React.useState("");
  useEffect(() => {
    const HighlightPref = (prefix, pubkey) => {
      let pubkeySub = pubkey.substring(0, prefix.length);
      let prefixSub = pubkey.substring(prefix.length, pubkey.length);
      return (
        <Stack direction="row" alignItems="center">
          <Box sx={{ color: "#44ff00" }}>
            <Typography variant="h6">{pubkeySub}</Typography>
          </Box>
          <Typography variant="h6">{prefixSub}</Typography>
        </Stack>
      );
    };
    setHighlight(HighlightPref(prefix, publicKey));
  }, [prefix, publicKey]);

  const [doneGenerating, setDoneGenerating] = React.useState(false);

  return (
    <div>
      <Container sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper
              sx={{
                bgcolor: "#000000",
                color: "#ffffff",
                border: "1px solid #8c8c8c",
                borderRadius: "25px",
                padding: "5px",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="h4">Nostr Vanity KeyGen</Typography>
                <PaddedDivider />
                <Typography>
                  {
                    "Generation happens locally in your browser. You can disconnect from the internet before running  and you can close the window after generation (before reconnecting to the internet)."
                  }
                </Typography>
                <PaddedDivider />
                <Typography>
                  Source code is public and is available on github at the link
                  below
                </Typography>
                <Link href={"https://github.com/"}>
                  <Typography> Link to github</Typography>
                </Link>
                <PaddedDivider />
                <Typography>My current nostr: </Typography>
              </Box>
            </Paper>
          </Grid>
          {doneGenerating && (
            <Grid item xs={12}>
              <Paper
                sx={{
                  bgcolor: "#000000",
                  color: "#ffffff",
                  border: "1px solid #8c8c8c",
                  borderRadius: "25px",
                  padding: "5px",
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">Public Key</Typography>
                  {highlight}
                  <Typography variant="h6">Private Key</Typography>
                  <Typography variant="h6"> {privateKey}</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigator.clipboard.writeText(privateKey)}
                  >
                    Copy Private Key
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}
          <Grid item xs={12}>
            <Paper
              sx={{
                bgcolor: "#000000",
                color: "#ffffff",
                border: "1px solid #8c8c8c",
                borderRadius: "25px",
                padding: "5px",
              }}
            >
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
                    <Chip color={"info"} label={"Currently In Slow Mode"} />
                  ) : (
                    <Chip color={"error"} label={"Currently In Fast Mode"} />
                  )}
                </Stack>
                <Stack spacing={2} sx={{ pb: 2 }}>
                  <Paper
                    sx={{
                      bgcolor: "#000000",
                      color: "#ffffff",
                      border: "1px solid #8c8c8c",
                      borderRadius: "25px",
                      padding: "5px",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography variant="caption">
                        {
                          "Slow mode will add a slight delay between each key pair generation. Use this mode if you are generating over a long period of time or don't have good hardware. When this mode is off key pairs will be generated as fast as possible which will be very resource intense."
                        }
                      </Typography>
                      <Typography variant="caption" color={"error"}>
                        {" Fast mode can potentially crash your browser."}
                      </Typography>
                    </Box>
                  </Paper>
                  <Paper
                    sx={{
                      bgcolor: "#000000",
                      color: "#ffffff",
                      border: "1px solid #8c8c8c",
                      borderRadius: "25px",
                      padding: "5px",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography align="center">
                        I do not recommend trying for more than 6 characters.
                        The prefix will get exponentially more difficult for
                        each character added.
                      </Typography>
                    </Box>
                  </Paper>
                  <Paper
                    sx={{
                      bgcolor: "#000000",
                      color: "#ffffff",
                      border: "1px solid #8c8c8c",
                      borderRadius: "25px",
                      padding: "5px",
                    }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      spacing={2}
                      sx={{ color: "#0288d1" }}
                    >
                      <Typography align={"center"} variant={"h6"}>
                        Your prefix must be hex, so you can only use the
                        following characters: 0123456789abcdef
                      </Typography>
                      <Box sx={{ p: 2 }}>
                        <Stack alignItems={"center"} justifyContent={"center"}>
                          <Button variant={"outlined"} onClick={handleOpen}>
                            Full list of hex words
                          </Button>
                        </Stack>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={{ color: "white", bgcolor: "black", p: 5 }}>
                            <Stack alignItems={"end"} sx={{ p: 2 }}>
                              <Button variant="outlined" onClick={handleClose}>
                                Close
                              </Button>
                            </Stack>
                            <Typography id="modal-modal-title" component="h2">
                              aba abaca abaf7 aba5e aba5ed aba5e5 ab8 ab8d ab85
                              abb abba abbe abbe55 abb07 abb075 abed abe1e abe7
                              abe75 abe77ed ab18 ab18d ab185 ab1e ab1e57 ab0de
                              ab0de5 ab5ce55 ab5ce55ed ab5ce55e5 accede acceded
                              accede5 acce55 acce55ed acce55e5 acc01ade
                              acc01ade5 acc057 acc057ed acc0575 ace ace5 ace7a1
                              ace78 ac7 ac7ab1e ac7ed add added add1e add5 ad0
                              ad0be ad5 aede5 affab1e affec7 affec7ed affec75
                              af10a7 af007 af7 a1a a1a5 a18 a1b a1ba a1ba7a
                              a1bed0 a1ca1de a1d01 a1d05e a1e a1ee a1fa1fa a11
                              a11e1e a11e1e5 a110ca7ab1e a110c8 a110c8d a110c85
                              a1107 a11075 a11077ed a11077ee a115eed a10e a10e5
                              a10f7 a100f a150 a17 a170 a5be5705 a5c07 a55 a55e5
                              a55e55 a55e55ed a55e55e5 a55e7 a55e75 a71a5 a7011
                              a70115 a77e57 a77e57ed a77e575 baa baba babb1e
                              babb1ed babb1e5 babe babe5 bacc8 bad bade bae1
                              baff1e baff1ed ba1 ba1a5 ba1a7a ba1b0a ba1d ba1e
                              ba1e5 ba11 ba11ad ba11ade ba11ad5 ba11a57 ba11a575
                              ba11a7a ba11ed ba11e7 ba11e75 ba1107 ba11075 ba115
                              ba15a ba0bab ba5a1 ba5a17 ba5e ba5eba11 ba5eba115
                              ba5ed ba5e1e55 ba5e5 ba55 ba55e5 ba55e7 ba550 ba57
                              ba57e ba57ed ba57e5 ba7 ba75 ba77 ba77ed ba771e
                              ba771ed ba771e5 bead beaded bead1e bead1e5 bead5
                              bea57 bea575 bea7 bea7ab1e bea75 bed bedabb1e
                              bedded bede1 bedfa57 bed5 bed57ead bed57ead5 bee
                              beef beefed beef5 bee5 bee7 bee71e bee71ed bee71e5
                              bee75 befa11 befa115 befe11 bef001 be1 be18d be11
                              be11e be11e5 be115 be17 be17ed be175 be5e7 be5e75
                              be507 be5077ed be57 be57ead be57ed be575 be7 be7a
                              be7e1 be75 be77a b1ab b1abbed b1ab5 b1ade b1ade5
                              b1a5e b1a57 b1a57ed b1a570c0e1 b1a575 b1a7 b18
                              b1ea7 b1ea75 b1eb b1ed b1eed b1eed5 b1e55 b1e55ed
                              b1e57 b10a7 b108d b10a75 b10b b10b5 b10c b10c5
                              b100d b100ded b100d1e55 b100d5 b107 b1075 b1077ed
                              b10770 b0a b0a57 b0a57ed b0a575 b0a7 b081 b0a710ad
                              b0a710ad5 b0a75 b0b b0bbed b0bb1e b0bca7 b0b5
                              b0b51ed b0d b0de b0de5 b01a b01d b01de57 b01dface
                              b01e b011 b010 b017 b017ed b0175 b00 b00b b00b00
                              b00d1e b005 b0057 b0057ed b00575 b007 b007ab1e
                              b007ed b007ee b0071ace b0071e55 b0075 b055 b055ed
                              b055e5 b07 b07e1 b075 b077 b0771e b0771ed b0771e5
                              cab caba1 caba1a caba55e7 cabba1a cab1e cab1ed
                              cab1e5 cab1e7 cab0b cab00d1e cab005e cab5 caca0
                              cad cade cade11e cade7 cafe cafe5 ca1ab005e ca1ce5
                              ca1f ca11 ca11a ca11ab1e ca11ed ca115 ca1077e ca5a
                              ca5aba ca5cabe1 ca5cadab1e ca5cade ca5caded
                              ca5cade5 ca5e ca5ea5e ca5e8 ca5ed ca5e05e ca5e5
                              ca55aba ca55e77e ca57 ca57e ca57e118d ca57e5
                              ca571e ca571ed ca571e5 ca570ff ca575 ca7 ca7a1a5e
                              ca7a10 ca7b0a7 ca7ca11 ca7fa11 ca75 ca77a10 ca771e
                              cea5e cea5ed cea5e1e55 cea5e5 cede ceded ce1e57a
                              ce11 ce11a ce11ed ce110 ce115 ce17 ce55 ce57a
                              ce570de c1ad c1a55 c1a55ed c1a55e5 c1a551e55 c1ea7
                              c1ef c1ef7 c1ef75 c10aca c10d c10d5 c105 c105e
                              c105ed c105e5 c105e57 c105e7 c105e7ed c105e75 c107
                              c0ac7 c0a1 c0a1e5ce c0a1e5ced c0a1e5ce5 c0a15
                              c0a57 c0a57a1 c0a57ed c0a575 c0a7 c08d c08e c0a75
                              c0b c0ba17 c0bb1e c0b1e c0ca c0c0 c0c0a c0c077e
                              c0d c0da c0dd1e c0de c0ded c0de5 c0ed c0e1057a7
                              c0ff c0ffee c0ffee5 c0ff1e c01 c01a c01d c01de57
                              c01d5 c01e c0118 c011ec7 c011ec7ed c011ec75 c011e7
                              c0110c8 c01055a1 c017 c0175 c0175f007 c00 c00ee
                              c001 c001ed c001e57 c0015 c007 c05 c05ec c05e7
                              c055 c055e7 c057 c057a c0578 c057ed c0575 c07 c07e
                              c075 c077a c5c dab dabb1e dabb1ed dabb1e5 dace dad
                              dad0 dad5 daeda1 daff daf7 da1e da1e5 da7a
                              da7aba5e da7aba5e5 d8d d81e55 d85 da70 dead
                              deadbea7 deadfa11 deaf deafe57 dea1 dea18 dea110c8
                              dea110c8d dea15 dea17 deb debac1e deba5e deba7ab1e
                              deb8 deb8d deb85 deb7 deb75 decade decade5 decaf
                              deca1 decea5e decea5ed decea5e5 dec1a55 dec0c7
                              dec0de dec0ded dec0de5 dec0118 deed deeded deed5
                              deface defa1c8 defea7 defe8d defea75 defec8 defec7
                              defec7ed defec75 def18 def1ec7 def1ec7ed def7 de18
                              de1e de1ec7ab1e de1ec78 de1e7e de1e7ed de1e7e5
                              de1f7 de11 de115 de17a de17a5 de5018 de7ec7
                              de7ec7ab1e de7ec7ed de7ec75 de7e57 de7e57ab1e
                              de7e57ed d0ab1e d0b1a d0c d0d0 d0e d0e5 d0ff d01
                              d01ce d01e d01ed d01e5 d011 d0115 d017 d00dad
                              d00d1e d05e d05ed d05e5 d055 d055a1 d057 d07 d07e
                              d07ed d07e5 d075 d077ed d0771e ea5e ea5ed ea5e1
                              ea5e5 ea57 ea7 ea7ab1e ea7ab1e5 ea75 ebb ebb5
                              ec1a7 ec70b1a57 edd0 ee1 ee15 effab1e efface
                              effec7 effec7ed effec75 effe7e ef7 e18 e18d e1d
                              e1de57 e1ec7 e1ec7ed e1ec75 e1f e11 e15e e5ca1ade
                              e5ca18 e5ca18d e5ca185 e55e e57afe77e e578 e5785
                              e7a fab fab1e fab1ed fab1e5 facade facaded facade5
                              face faced face1e55 face5 face7 face7ed face75
                              fac7 fac70 fac75 fad fade faded fade1e55 fade5
                              fad0 faece5 fa1ba1a fa1c8 fa1d57001 fa11 fa11a1
                              fa115 fa15e fa15e770 fa17b0a7 fa5ce5 fa57 fa57ed
                              fa57e57 fa575 fa7 fa7a1 fa7a15 f8d f85 fa75 fa750
                              fa77e57 fea1 fea57 fea57ed fea575 fea7 fea75 feca1
                              fece5 fed fee feeb1e feeb1e57 feed feed5 fee1
                              fee15 fee5 fee7 fe1afe1 fe11 fe11ed fe110e fe17
                              fe175 fe0ff fe0ffee fe55 fe57a1 fe7a1 fe7e fe771e
                              f1abe118 f1a7 f1a7bed f1a7b0a7 f1a7f007 f1a7f007ed
                              f1a75 f1a77e57 f1ea f1ea5 f1ed f1ee f1eece f1eece5
                              f1ee5 f1ee7 f1ee7e57 f1ee75 f10a7 f10a7ab1e f108d
                              f10a75 f10cc05e f10e f100d f100ded f100d5 f1055
                              f1055ed f1055e5 f0a1 f0b f0ca1 f0e f0e5 f01d
                              f01db0a7 f01ded f01d5 f00d f00d5 f001 f001ed f0015
                              f005ba11 f007 f007ba11 f007ba115 f007ed f007fa11
                              f0071e f0071e55 f0071005e f00757a11 f00757001
                              f055a f055e f055e77e 1ab 1abe1 1abe1ed 1abe11ed
                              1abe15 1ab1ab 1ab5 1ac 1ace 1aced 1ace5 1ac7a5e
                              1ac78 1ac7ea1 1ac705e 1ad 1ade 1ad1e 1ad5 1a5e
                              1a55 1a55e5 1a550 1a57 1a57ed 1a575 1a7 18d 1857
                              1ea 1ead 1eaded 1ead5 1eaf 1eafed 1eaf1e55 1eaf1e7
                              1eaf1e75 1ea1 1ea5e 1ea5ed 1ea5e5 1ea57 1ed 1ee
                              1ee5 1ee7 1ef7 1e55 1e55ee 1e57 1e7 1e75 10ad
                              10aded 10ad5 10af 10afed 10b 10b8 10be 10be5 10b0
                              10ca1 10ca1e 10ca15 10c8 10c8d 10c85 10c0 10de
                              10e55 10f7 10f75 1011 100 1005e 1005ed 1005e1eaf
                              1005e5 1005e57 1007 1007ed 10075 105e 105e1 105e5
                              1055 1055e5 1057 107 107a 1075 10770 0af 0a5e5
                              0a57 0a7 0a75 0be5e 0b1a57 0b18 0b0e 0b5e55
                              0b501e5ce 0b501e7e 0b501e7ed 0b501e7e5 0b57ac1e
                              0b57ac1e5 0b7ec7 0b7e57 0ce107 0c7ad 0c7a1 0c7e7
                              0c7e75 0dd 0ddba11 0dde57 0dd5 0de 0de5 0ff 0ffa1
                              0ffbea7 0ff10ad 0ff5 0ff5e7 0ff5e75 0f7 01d 01de57
                              01e8 01e0 011a 00d1e5 00f 057ea1 057e0b1a57
                              057e0c1a57 0770 5ab1e 5ab1e5 5ac 5ad 5adde57
                              5add1e 5add1ed 5add1e5 5afe 5afe5 5afe57 5a1ab1e
                              5a1ad 5a1ade 5a1ad5 5a1e 5a1eab1e 5a1e5 5a11e7
                              5a101 5a17 5a17ed 5a175 5a55 5a7 58d 585 5cab
                              5cabb1e 5cad 5caff01d 5caff01d5 5ca1ab1e 5ca1ade
                              5ca1d 5ca1ded 5ca1e 5ca1ed 5ca1e5 5ca7 5c1aff
                              5c0ff 5c0ffed 5c0ff5 5c01d 5c01ded 5c01d5 5c007
                              5c07 5ea 5eac0a57 5eac0a575 5eaf00d 5ea1 5ea1ed
                              5ea15 5ea5 5ea7 5e8d 5ea75 5ec 5ecc0 5ecede
                              5eceded 5ecede5 5ec7 5ec75 5ed8 5ee 5eed 5eedbed
                              5eedca5e 5eeded 5eed5 5ee1 5ee5 5e1ec7 5e1ec7ed
                              5e1ec7ee 5e1ec75 5e1f 5e1f1e55 5e11 5e115 5e57e7
                              5e7 5e7a 5e705e 5e75 5e77 5e77ab1e 5e77ee 5e771e
                              5e771ed 5e771e5 51ab 51a7 518 518d 5185 51a75 51ed
                              51ed5 51ee7 510b 510e 5107 51075 51077ed 50b 50b5
                              50c1e 50d 50da 50d5 50fa 50fa5 50f7 50f7a 50f7ba11
                              50f7e57 501 501a 501ace 501aced 501d 501d0 501e
                              501e5 5010 50105 5007 507 5077ed 57ab 57abbed
                              57ab1e 57ab1ed 57ab1e5 57ab5 57acca70 57ac7e 57aff
                              57affed 57aff5 57a1e 57a11 57a11ed 57a115 578 578d
                              5781e55 5785 57ead 57eadfa57 57ea1 57ea15 57edfa57
                              57eed 57ee1 57ee1ed 57ee15 57e1a 57e1e 57e118 57e7
                              570a 570a7 570b 5701e 5701e5 5700d 57001 57055 7ab
                              7abe5 7ab1e 7ab1ed 7ab1e5 7ab1e7 7ab1e75 7ab00
                              7ab005 7ab5 7ace 7ace7 7ac0 7ac7 7ac71e55 7ad 7ae1
                              7affe7a 7a1c 7a1e 7a1e5 7a11 7a11e57 7a55 7a55e
                              7a55e1 7a55e15 7a55e7 7a57e 7a57ed 7a57e1e55
                              7a57e5 7a7 7a771e 7a771e7a1e 7a7700 7a7700ed
                              7a77005 7ea 7ea1 7ea5 7ea5e 7ea5ed 7ea5e1 7ea5e5
                              7ea7 7ed 7ee 7ee707a1 7e1eca57 7e1e057 7e11 7e115
                              7e117a1e 7e51a 7e55e118 7e55e118d 7e57 7e57a
                              7e57ab1e 7e578 7e57ed 7e57ee 7e57e5 7e575 70ad
                              70ad5 70ad57001 70a57 70a57ed 70a575 70bacc0
                              70cca7a 70d 70dd1e 70e 70ed 70e5 70ffee 70f7 701a
                              701d 701e 7011 7011ed 70115 700 7001 7001ed 70015
                              7007 70071e 70075 7055 7055ed 7055e5 707 707a1
                              707a1ed 707a11ed
                            </Typography>
                          </Box>
                        </Dialog>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
                <Stack direction="column" spacing={2}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Prefix"
                    variant="outlined"
                    value={prefix}
                    onChange={handleChangePrefix}
                    inputProps={{
                      style: {
                        bgcolor: "black",
                        color: "white",
                        border: "2px solid #0288d1",
                        margin: "5px",
                      },
                    }}
                  />
                  {loading === "true" ? (
                    <Chip label="Generating..." color="success" />
                  ) : checked ? (
                    <Button
                      variant="contained"
                      onClick={VanityPairSlow}
                      loading={loading}
                    >
                      Generate Vanity Key Pair Slow
                    </Button>
                  ) : (
                    <>
                      <Typography
                        variant="caption"
                        color={"error"}
                        align="center"
                      >
                        {
                          "Progress will be shown in increments of 3000 in fast mode"
                        }
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={VanityPair}
                        loading={loading}
                        color="error"
                      >
                        Generate Vanity Key Pair
                      </Button>
                    </>
                  )}
                  {checked
                    ? addressesGenerated > 0 && (
                        <Typography>
                          Generated {addressesGenerated} key pairs before
                          desired prefix was found
                        </Typography>
                      )
                    : addressesGenerated > 0 && (
                        <Typography>
                          Generated {addressesGenerated} addresses before pair
                          was found
                        </Typography>
                      )}
                </Stack>
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
