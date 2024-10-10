import { Text, StyleSheet, View, ScrollView } from "react-native"

export function AboutScreen() {

    // TODO: NEEDS UPDATING FROM SERENE
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.text}>
                Mobile App EULA for Official PSU Android Apps
            </Text>

            <Text style={styles.text}>
                The product received (“Licensed Application”) is licensed, not sold, to You for use only under the terms of this license. The Pennsylvania State University (“PSU”) reserves all rights not expressly granted to You.
            </Text>

            <Text style={styles.text}>
                Scope. The license granted to you for the Licensed Application is limited to a non-transferable license to use the Licensed Application. You may not rent, lease, lend, sell, redistribute or sublicense the Licensed Application. You may not copy (except as expressly permitted elsewhere in this license), decompile, reverse engineer, disassemble, attempt to derive the source code of, modify, or create derivative works of the Licensed Application, any updates, or any part thereof. If You breach this restriction, You may be subject to prosecution and damages. The terms of the license will govern any upgrades provided by PSU that replace and/or supplement the original Product, unless such upgrade is accompanied by a separate license in which case the terms of that license will govern.
            </Text>

            <Text style={styles.text}>
                Consent to Use of Data. You agree that PSU may collect and use technical data and related information, including but not limited to technical information about Your device, system and application software, and peripherals, that is gathered periodically to facilitate the provision of software updates, product support and other services to You (if any) related to the Licensed Application. PSU may use this information, as long as it is in a form that does not personally identify You, to improve its products or to provide services or technologies to You.
            </Text>

            <Text style={styles.text}>
                Termination. The license is effective until terminated by You or PSU. Your rights under this license will terminate automatically without notice from PSU if You fail to comply with any term(s) of this license. Upon termination of the license, You shall cease all use of the Licensed Application, and destroy all copies, full or partial, of the Licensed Application.
            </Text>

            <Text style={styles.text}>
                Use of the Licensed Application and any related services may require Internet access, which is Your responsibility.
            </Text>

            <Text style={styles.text}>
                Third Party Materials. The Licensed Application may enable access to PSU and third party services and web sites (collectively and individually, “Services”). You understand that by using any of the Services, You may encounter content that may be deemed offensive, indecent or objectionable, which content may or may not be identified as having explicit language, and that the results of any search or entering of a particular URL may automatically and unintentionally generate links or references to objectionable material. Nevertheless, You agree to use the Services at Your sole risk and that PSU shall not have any liability to You for content that may be found to be offensive, indecent or objectionable. PSU is not responsible for examining or evaluating the content, accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality or other aspects of any third party sites. Access to any third party sites is provided solely as a convenience to You. Location data provided by any Services is for basic navigational purposes only and is not intended to be relied upon in situations where precise location information is needed or where erroneous, inaccurate or incomplete location data may lead to death, personal injury, property or environmental damage. PSU does not guarantee the availability, accuracy, completeness, reliability or timeliness of stock information or location data displayed by any Services.
            </Text>

            <Text style={styles.text}>
                You agree that any Services contain proprietary content, information and material that is protected by intellectual property and other laws, including but not limited to copyright, and that You will not use such proprietary content, information or materials in any way whatsoever except for permitted use of the Services. No portion of the Services may be reproduced in any form or by any means. You agree not to use the Services in any manner to harass, abuse, stalk, threaten, defame or otherwise infringe or violate the rights of any other party, and that PSU is not in any way responsible for any such use by You, nor for any harassing, threatening, defamatory, offensive or illegal messages or transmissions that You may receive as a result of using any of the Services.
            </Text>

            <Text style={styles.text}>
                PSU makes no representation that Licensed Application or Services are appropriate or available for use in any particular location. You are responsible for compliance with any applicable laws, including but not limited to applicable local laws. PSU reserves the right to change, suspend, remove, or disable access to any Service at any time without notice. In no event will PSU be liable for the removal of or disabling of access to any such Licensed Application or Services. PSU may also impose limits on the use of or access to certain Services, in any case and without notice or liability.
            </Text>

            <Text style={styles.text}>
                NO WARRANTY: YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT USE OF THE LICENSEDAPPLICATION IS AT YOUR SOLE RISK AND THAT THE ENTIRE RISK AS TO SATISFACTORY QUALITY, PERFORMANCE, ACCURACY AND EFFORT IS WITH YOU. TO THE MAXIMUM EXTENT PERMITTED BY APPLICBLE LAW, THE LICENSED APPLICATION AND ANY SERVICES PERFORMED OR PROVIDED BY THE LICENSED APPLICATION (“SERVICES”) ARE PROVIDED “AS IS” AND “AS AVAILABLE”, WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, AND PSU HEREBY DISCLAIMS ALL WARRANTIES AND CONDITIONS WITH RESPECT TO THE LICENSED APPLICATION AND ANY SERVICES, EITHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND/OR CONDITIONS OF MERCHANTABILITY, OF SATISFACTORY QUALITY, OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY, OF QUIET ENJOYMENT, AND NON-INFRINGEMENT OF THIRD PARTY RIGHTS. PSU DOES NOT WARRANT AGAINST INTERFERENCE WITH YOUR ENJOYMENT OF THE LICENSED APPLICATION, THAT THE FUNCTIONS CONTAINED IN, OR SERVICES PERFORMED OR PROVIDED BY, THE LICENSED APPLICATION WILL MEET YOUR REQUIREMENTS, THAT THE OPERATION OF THE LICENSED APPLICATION OR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, OR THAT DEFECTS IN THE LICENSED APPLICATION OR SERVICES WILL BE CORRECTED. NO ORAL OR WRITTEN INFORMATION OR ADVICE GIVEN BY APPLICATION PROVIDER OR ITS AUTHORIZED REPRESENTATIVE SHALL CREATE A WARRANTY. SHOULD THE LICENSED APPLICATION OR SERVICES PROVE DEFECTIVE, YOU ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES OR LIMITATIONS ON APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO THE ABOVE EXCLUSION AND LIMITATIONS MAY NOT APPLY TO YOU.
            </Text>

            <Text style={styles.text}>
                Limitation of Liability. TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL PSU BE LIABLE FOR PERSONAL INJURY, OR ANY INCIDENTAL, SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA,
            </Text>

            <Text style={styles.text}>
                BUSINESS INTERRUPTION OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OR INABILITY TO USE THE LICENSED APPLICATION, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT OR OTHERWISE) AND EVEN IF APPLICATION PROVIDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICITONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITAITON MAY NOT APPLY TO YOU. In no event shall PSU’s total liability to you for all damages (other than as may be required by applicable law in cases involving personal injury) exceed the amount of paid for the license. The foregoing limitations will apply even if the above stated remedy fails of its essential purpose.
            </Text>

            <Text style={styles.text}>
                The laws of the Commonwealth of Pennsylvania, excluding its conflicts of law rules, govern this license and your use of the Licensed Application. Your use of the Licensed Application may also be subject to other local, state, national or international laws.
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        color: "white",
        marginBottom: 10
    },
    bold: {
        fontWeight: "bold"
    }
})