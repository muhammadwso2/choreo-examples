/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { BrandingPreference } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { commonControllerDecode } from "@pet-management-webapp/shared/data-access/data-access-common-api-util";
import { Personalization } from "apps/business-admin-app/types/personalization";
import { de } from "date-fns/locale";
import { controllerCallGetBrandingPreference } from "libs/business-admin-app/data-access/data-access-controller/src/lib/controller/branding/controllerCallGetBrandingPreference";
import { Session } from "next-auth";

/**
* 
* @param session - session object
*
* @returns the branding preferences of the current logged in organization mapped into a Peronalization object. 
*/
export async function getPersonalizationFromServer(session: Session): Promise<Personalization | null> {

  const res = (await commonControllerDecode(() => controllerCallGetBrandingPreference(session), null) as
      BrandingPreference | null);

  const activeTheme: string = res["preference"]["theme"]["activeTheme"];                        

  const orgPersonalization: Personalization = {
      faviconUrl: res["preference"]["theme"][activeTheme]["images"]["favicon"]["imgURL"],
      logoAltText: res["preference"]["theme"][activeTheme]["images"]["logo"]["altText"],
      logoUrl: res["preference"]["theme"][activeTheme]["images"]["logo"]["imgURL"],
      orgId: session.orgId,
      primaryColor: res["preference"]["theme"][activeTheme]["colors"]["primary"]["main"],
      secondaryColor: res["preference"]["theme"][activeTheme]["colors"]["secondary"]["main"]
  };

  if (orgPersonalization.logoUrl == "") {
    orgPersonalization.logoUrl = "https://raw.githubusercontent.com/vihanga-liyanage/choreo-examples/upgraded-b2b-app" +
      "/b2b-apps/pet-care-app/pet-management-webapp/libs/business-admin-app/ui/ui-assets/src/lib/images/petcare-no-bg.png";
  }

  if (orgPersonalization.faviconUrl == "") {
    orgPersonalization.faviconUrl = "https://user-images.githubusercontent.com/1329596/242288450-b511d3dd-5e02-434f-9924-3399990fa011.png";
  }

  return orgPersonalization;

}

export function getDefaultPersonalization() : Personalization {

  return {
    faviconUrl: "https://user-images.githubusercontent.com/1329596/" + 
        "242288450-b511d3dd-5e02-434f-9924-3399990fa011.png",
    logoAltText: "Pet Care App Logo",
    logoUrl: "https://raw.githubusercontent.com/vihanga-liyanage/choreo-examples/upgraded-b2b-app/b2b-apps/pet-care-app" +
      "/pet-management-webapp/libs/business-admin-app/ui/ui-assets/src/lib/images/petcare-no-bg.png",
    orgId: "",
    primaryColor: "#4F40EE",
    secondaryColor: "#E0E1E2"
  };
}

export default getPersonalizationFromServer;
