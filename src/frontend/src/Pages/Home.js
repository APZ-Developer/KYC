import {
    Card,
//    Image,
    View,
    Heading,
    Flex,
    Text,
    Button,
    useTheme,
//    Link,
    ButtonGroup,
//    Collection

} from '@aws-amplify/ui-react';
import { useNavigate } from "react-router-dom"
//import YouTube from 'react-youtube';
function Home() {

    const { tokens } = useTheme();
    const navigate = useNavigate()

    return (
        <>
            <View direction={{ base: 'column', large: 'row' }}>
                <Heading level={1} color="black">
                    Identity Verification
                </Heading>
                <Heading level={5} color="black" >
                    Verify user identity online using machine learning.
                </Heading>
                <ButtonGroup marginTop={tokens.space.large}>
                    <Button backgroundColor="#ec7211" variation="primary" onClick={() => navigate(`/registerwithid`)} color="black">

                        Register

                    </Button>
                </ButtonGroup>
            </View>
            
            <Heading
                level={4}
                isTruncated={true}
                color="black"
                marginTop={tokens.space.large}
            >
                How it works
            </Heading>
            
            <View marginTop={tokens.space.large} direction={{ base: 'column', large: 'row' }}>

                <Card>
                    <Flex alignItems="flex-start"
                        backgroundColor={tokens.colors.background.secondary}
                        marginTop={tokens.space.large}
                        direction={{ base: 'column', large: 'row' }}>
                        <Text
                            as="span"
                            color="black"
                        >
                        <Text as="span">1. Keep your ID card ready with you.</Text><br />
                        <Text as="span">2. Username should be same as the number printed on ID card.</Text><br />
                        <Text as="span">3. You will be asked to upload your ID card photo in jpg/png format.</Text><br />
                        <Text as="span">4. Please make sure that you enter proper details.</Text><br />
                         </Text>

                    </Flex>
                </Card>
            </View>
        </>
    );
}

export default Home;
