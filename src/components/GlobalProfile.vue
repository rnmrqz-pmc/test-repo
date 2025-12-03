<template>
    <div class="pa-4 ">
        <!-- Header Card -->
        <v-card class="profile-header mb-6" variant="flat" color="transparent" elevation="3">
            <div class="gradient-bg">
                <v-card-text class="pt-4 pb-1 px-5">
                    <div class="d-flex justify-space-between align-center mb-4">
                        <div>
                            <h1 class="text-h4 text-white font-weight-bold mb-2">Trainer Profile</h1>
                            <p class="text-subtitle-1 text-white opacity-90">Manage your professional information</p>
                        </div>
                        <div>
                            <v-btn 
                                @click="passwordModel.status = true"
                                :color="isEdit ? 'white' : 'rgba(255,255,255,0.9)'"
                                :variant="isEdit ? 'tonal' : 'elevated'"
                                rounded="xl"
                                :disabled="isEdit"d
                                class="edit-btn mx-2"
                            >
                                <v-icon start>mdi-form-textbox-password</v-icon>
                                Change Password
                            </v-btn>
                            <v-btn 
                                @click="editProfile" 
                                :color="isEdit ? 'white' : 'rgba(255,255,255,0.9)'"
                                :variant="isEdit ? 'tonal' : 'elevated'"
                                :disabled="isEdit"
                                rounded="xl"
                                class="edit-btn"
                            >
                                <v-icon start>mdi-pencil</v-icon>
                                {{ isEdit ? 'Editing' : 'Edit Profile' }}
                            </v-btn>
                        </div>
                   
                    </div>
                </v-card-text>
            </div>
        </v-card>

        <!-- Main Profile Card -->
        <v-card class="profile-card" variant="flat" elevation="4">
            <v-card-text class="py-2 px-6">
                <!-- Personal Information Section -->
                <div class="section-container mb-8 pt-2">
                        <!-- <v-icon class="section-icon">mdi-account-circle</v-icon> -->
                    <h2 class="p-title">Personal Information</h2>
                    <v-divider class="my-2"></v-divider>
                    
                    <v-row class="align-stretch pa-2 ma-0">
                        <!-- Avatar Section -->
                        <v-col cols="12" lg="3" md="4" sm="12" class="d-flex justify-center">
                            <div class="avatar-section">
                                <div class="avatar-container" :class="{ 'edit-mode': isEdit }">
                                    <v-avatar 
                                        size="160" 
                                        class="avatar-main"
                                        :class="{ 'hover-effect': isEdit }"
                                    >
                                        <img v-if="preview" :src="preview" class="avatar-img" />
                                        <img v-else-if="profileImg" :src="profileImg" class="avatar-img" />
                                        <v-icon v-else size="80" color="grey-lighten-1">mdi-account</v-icon>
                                        <div v-if="isEdit" class="avatar-overlay">
                                            <v-icon color="white" size="32">mdi-camera</v-icon>
                                        </div>
                                    </v-avatar>
                                    <input
                                        v-if="isEdit"
                                        type="file"
                                        accept="image/*"
                                        class="avatar-input"
                                        @change="onImageChange"
                                    />
                                </div>
                                <p class="text-center mt-3 text-body-2 text-medium-emphasis">
                                    {{ isEdit ? 'Click to upload image' : '' }}
                                </p>
                            </div>
                        </v-col>

                        <!-- Info Grid -->
                        <v-col cols="12" lg="9" md="8" sm="12">
                            <v-row class="info-grid">
                                <v-col class="pa-0 ma-0" cols="12" sm="6" lg="5">
                                    <div class="card-item pa-4 card-hover-y">
                                        <label class="p-bold uppercase">Full Name</label>
                                        <p class="p-text">{{ trainer.profile.full_name }}</p>
                                    </div>
                                </v-col>
                                <v-col class="pa-0 ma-0" cols="12" sm="6" lg="5">
                                    <div class="card-item pa-4 card-hover-y">
                                        <label class="p-bold uppercase">Employee No</label>
                                        <p class="p-text">{{ trainer.profile['employeeNo'] }}</p>
                                    </div>
                                </v-col>
                                <v-col class="pa-0 ma-0" cols="12" sm="6" lg="5">
                                    <div class="card-item pa-4 card-hover-y">
                                        <label class="p-bold uppercase">Position</label>
                                        <p class="p-text">{{ trainer.profile['position'] }}</p>
                                    </div>
                                </v-col>
                                <v-col class="pa-0 ma-0" cols="12" sm="6" lg="5">
                                    <div class="card-item pa-4 card-hover-y">
                                        <label class="p-bold uppercase">Team</label>
                                        <p class="p-text">{{ trainer.profile['team'] }}</p>
                                    </div>
                                </v-col>
                                <v-col class="pa-0 ma-0" cols="12" sm="6" lg="5">
                                    <div class="card-item pa-4 card-hover-y">
                                        <label class="p-bold uppercase">Email</label>
                                        <p class="p-text">{{ trainer.profile['email'] }}</p>
                                    </div>
                                </v-col>
                                <v-col class="pa-0 ma-0" cols="12" sm="6" lg="5">
                                    <div class="card-item pa-4 card-hover-y">
                                        <label class="p-bold uppercase">Mobile Number <span v-if="isEdit" class="required">*</span></label>
                                        <p v-if="!isEdit" class="p-text">{{ trainer.details['phone'] }}</p>
                                        <v-text-field 
                                            v-else 
                                            v-model="model.phone" 
                                            type="tel" 
                                            maxlength="13" 
                                            counter="13" 
                                            @input="validatePhone"
                                            variant="outlined" 
                                            density="comfortable"
                                            placeholder="e.g. 09123456789"
                                            hide-details
                                            class=" small-input"
                                        />
                                    </div>
                                </v-col>
                                
                            </v-row>
                        </v-col>
                    </v-row>

                    <!-- Bio Section -->
                    <div class="card-item card-hover-y pa-4 mt-6 px-5">
                        <label class="p-bold uppercase">Trainer Bio <span v-if="isEdit" class="required">*</span></label>
                        <v-textarea 
                            v-if="isEdit" 
                            v-model="model.bio"
                            variant="outlined" 
                            color="primary"
                            rows="4"
                            placeholder="Tell us about yourself, your experience, and training philosophy..."
                            hide-details
                            class="modern-textarea mt-2"
                        />
                        <p v-else class="p-text mt-2">{{ trainer.details ? trainer.details['bio'] : 'No bio available' }}</p>
                    </div>
                </div>
                <!-- Credentials Section -->
                <div class="section-container pt-2">
                    <h2 class="p-title">Credentials and Qualifications</h2>
                    <v-divider class="my-2"></v-divider>

                    <!-- Academic Qualifications -->
                    <div class=" mb-8 pt-2">
                        <h3 class="subsection-title">
                            <v-icon class="mr-2" color="primary">mdi-book-open-variant</v-icon>
                            Academic Qualifications 
                            <span v-if="isEdit" class="required">*</span>
                        </h3>
                        <template v-if="!isEdit">
                            <div v-for="(item, id) in (trainer.details['academic'])" :key="id" class="side-card-1 pa-4 card-hover-x">
                                <div class="credential-content">
                                    <label class="p-text p-bold">{{ item.course }}</label>
                                    <p class="p-text text-grey-darken-2">{{ item.university }}</p>
                                    <div class="credential-meta pt-1">
                                        <v-chip  color="blue" variant="tonal">{{ item.start }} - {{ item.end }}</v-chip>
                                    </div>
                                </div>
                            </div>
                            <div v-if="trainer.details['academic']?.length == 0">
                                <p class="p-text text-grey-darken-2">No academic qualifications available</p>
                            </div>
                        </template>
                        
                        <template v-else>
                            <div class="input-form mb-4">
                                <v-row>
                                    <v-col class="pb-0 mb-0" cols="12" md="4">
                                        <v-combobox 
                                            v-model="model.academic.course"
                                            label="Course"
                                            :items="COURSE_LIST"
                                            variant="outlined"
                                            density="comfortable"
                                            hide-details
                                        />
                                    </v-col>
                                    <v-col class="pb-0 mb-0" cols="12" md="4">
                                        <v-combobox 
                                            v-model="model.academic.university"
                                            label="University"
                                            :items="UNIVERSITY_LIST"
                                            variant="outlined"
                                            density="comfortable"
                                            hide-details
                                        />
                                    </v-col>
                                    <v-col class="pb-0 mb-0" cols="6" md="2">
                                        <v-text-field
                                            v-model="model.academic.start"
                                            label="Start Year"
                                            type="number"
                                            variant="outlined"
                                            density="comfortable"
                                            @input="validateYear(1)"
                                            :rules="[
                                                v => !!v || 'Year is required',
                                                year_rule,
                                                v => parseInt(v) <= new Date().getFullYear() || 'Year must not exceed the current year'
                                            ]"

                                        />
                                    </v-col>
                                    <v-col class="pb-0 mb-0" cols="6" md="2">
                                        <v-text-field
                                            v-model="model.academic.end"
                                            label="End Year"
                                            type="number"
                                            variant="outlined"
                                            density="comfortable"
                                            :rules="[
                                                v => !!v || 'Year is required',
                                                year_rule,
                                                v => parseInt(v) >= parseInt(model.academic.start) || 'End year must not be less than start year'
                                            ]"
                                            @input="validateYear(2)"
                                        />
                                    </v-col>
                                </v-row>
                                <div class="d-flex justify-end">
                                    <v-btn 
                                        @click="AddAcademic" 
                                        color="success"
                                        variant="elevated"
                                        rounded="xl"
                                        class="mt-4">
                                        <v-icon start>mdi-plus</v-icon>
                                        Add
                                    </v-btn>
                                </div>
                         
                            </div>
                            
                            <div v-for="(item, ida) in list.academic" :key="ida" class="added-item">
                                <div class="item-content">
                                    <div class="d-flex">
                                        <h4>{{ item.course }}</h4>
                                        <v-chip class="mx-2" size="small" color="primary" variant="tonal">{{ item.start }} - {{ item.end }}</v-chip>
                                    </div>
                                    <p class="text-medium-emphasis">{{ item.university }}</p>
                                </div>
                                <v-btn 
                                    @click="RemoveAcademic(ida)"
                                    color="error"
                                    variant="text"
                                    icon="mdi-close"
                                    size="small"
                                />
                            </div>
                        </template>
                    </div>

                    <!-- Professional Certifications -->
                    <div class=" mb-8">
                        <h3 class="subsection-title">
                            <v-icon class="mr-2" color="primary">mdi-certificate</v-icon>
                            Professional Certifications
                            <span v-if="isEdit" class="required">*</span>
                        </h3>
                        
                        <template v-if="!isEdit">
                            <div v-for="(item, idp) in trainer.details['professional']" :key="idp" class="side-card-1 pa-4 card-hover-x">
                                <div class="credential-content">
                                    <h4 class="p-text p-bold">{{ item.certificate }}</h4>
                                    <div class="credential-meta pt-1">
                                        <v-chip v-if="item.issued_on" color="info" variant="tonal" class="mr-2">
                                            Issued: {{ item.issued_on }}
                                        </v-chip>
                                        <v-chip v-if="item.valid_until" size="small" color="warning" variant="tonal">
                                            Valid until: {{ item.valid_until }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>
                        </template>
                        
                        <template v-else>
                            <div class="input-form mb-4">
                                <v-row>
                                    <v-col class="pb-0 mb-0" cols="12" md="12">
                                        <v-combobox 
                                            v-model="model.professional.certificate"
                                            label="Certification"
                                            :items="CERTIFICATE_LIST"
                                            variant="outlined"
                                            density="comfortable"
                                            hide-details
                                            class="mode"
                                        />
                                    </v-col>
                                    <!-- <v-col class="pb-0 mb-0" cols="6" md="2">
                                        <v-text-field
                                            v-model="model.professional.issued_on"
                                            label="Issued Year"
                                            type="number"
                                            variant="outlined"
                                            density="comfortable"
                                            @input="validateYear(3)"
                                            :rules="[
                                                v => !!v || 'Year is required',
                                                year_rule,
                                                v => parseInt(v) <= new Date().getFullYear() || 'Year must not exceed the current year'
                                            ]"
                                        />
                                    </v-col> -->
                                    <!-- <v-col class="pb-0 mb-0" cols="6" md="2">
                                        <v-text-field
                                            v-model="model.professional.valid_until"
                                            label="Valid Until"
                                            type="number"
                                            variant="outlined"
                                            density="comfortable"
                                            @input="validateYear(4)"
                                            :rules="[
                                                v => !!v || 'Year is required',
                                                year_rule,
                                                v => parseInt(v) >= parseInt(model.professional.issued_on) || 'End year must not be less than start year'
                                            ]"
                                        />
                                    </v-col> -->
                                </v-row>
                                <div class="d-flex justify-end">
                                <v-btn 
                                    @click="AddProfessional" 
                                    color="success"
                                    variant="elevated"
                                    rounded="xl"
                                    class="mt-4"
                                >
                                    <v-icon start>mdi-plus</v-icon>
                                    Add
                                </v-btn>
                                </div>
                            </div>
                            
                            <div v-for="(item, idp) in list.professional" :key="idp" class="added-item">
                                <div class="item-content">
                                    <h4>{{ item.certificate }}</h4>
                                    <div class="item-meta">
                                        <v-chip v-if="item.issued_on" size="small" color="info" variant="tonal" class="mr-2">
                                            Issued: {{ item.issued_on }}
                                        </v-chip>
                                        <v-chip v-if="item.valid_until" size="small" color="warning" variant="tonal">
                                            Valid until: {{ item.valid_until }}
                                        </v-chip>
                                    </div>
                                </div>
                                <v-btn 
                                    @click="
                                    RemoveProfessional(idp)"
                                    color="error"
                                    variant="text"
                                    icon="mdi-close"
                                    size="small"
                                />
                            </div>
                        </template>
                    </div>

                    <!-- Languages -->
                    <div class="mb-8">
                        <h3 class="subsection-title">
                            <v-icon class="mr-2" color="primary">mdi-translate</v-icon>
                            Languages
                            <span v-if="isEdit" class="required">*</span>
                        </h3>
                        
                        <template v-if="!isEdit">
                            <div class="language-chips">
                                <v-chip 
                                    v-for="(item, idp) in trainer.details['language']" 
                                    :key="idp"
                                    color="primary"
                                    variant="tonal"
                                    size="large"
                                    class="ma-1"
                                >
                                    <v-icon start>mdi-web</v-icon>
                                    {{ item.name }}
                                </v-chip>
                            </div>
                        </template>
                        
                        <template v-else>
                            <div class="input-form mb-4">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-autocomplete
                                            v-model="model.language.name"
                                            label="Select Language"
                                            variant="outlined"
                                            density="comfortable"
                                            hide-details
                                            :items="mx.lang"
                                            item-title="text"
                                            item-value="text"
                                        />
                                    </v-col>
                                </v-row>
                                <v-btn 
                                    @click="AddLanguage" 
                                    color="success"
                                    variant="elevated"
                                    rounded="xl"
                                    class="mt-4"
                                >
                                    <v-icon start>mdi-plus</v-icon>
                                    Add
                                </v-btn>
                            </div>
                            
                            <div class="">
                                <v-chip 
                                    v-for="(item, idp) in list.language" 
                                    :key="idp"
                                    color="primary"
                                    variant="tonal"
                                    size="large"
                                    class="ma-1"
                                >
                                    <v-icon start>mdi-web</v-icon>
                                    {{ item.name }}
                                    <v-icon @click="RemoveLanguage(idp)" 
                                    size="small" class="bg-red-lighten-1 globalRadius pa-2 ms-3" >mdi-close</v-icon>
                                </v-chip>
                            </div>
                        </template>
                    </div>
                    <!-- Training Licenses -->
                    <div class="mb-8">
                        <h3 class="subsection-title">
                            <v-icon class="mr-2" color="primary">mdi-license</v-icon>
                            Training Licenses
                        </h3>
                        
                        <template v-if="!isEdit">
                            <div v-for="(item, idp) in trainer.details['license']" :key="idp" class="side-card-1 pa-4 card-hover-x">
                                <div class="license-content">
                                    <h4 class="p-text p-bold">{{ item.name }}</h4>
                                    <v-btn 
                                        @click="viewDocument(item.file)" 
                                        color="primary"
                                        variant="tonal"
                                        size="small"
                                        rounded="xl"
                                        class="mt-2"
                                    >
                                        <v-icon start>mdi-file-document</v-icon>
                                        {{ item.file?.name }}
                                    </v-btn>
                                </div>
                            </div>
                            <p v-if="trainer.details['license']?.length === 0" class="text-medium-emphasis">No licenses uploaded</p>
                        </template>
                        
                        <template v-else>
                            <div v-if="hasLicense" class="input-form mb-4">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                            v-model="model.license.name"
                                            label="License Name"
                                            variant="outlined"
                                            density="comfortable"
                                            hide-details
                                        />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                          <v-file-input
                                            v-model="selectedFile"
                                            @change="onFileChange($event)"
                                            label="Accepted formats: JPEG, PNG, PDF | Max File Size: 5MB"
                                            variant="outlined"
                                            density="comfortable"
                                            hide-details
                                            accept="image/jpeg, image/png, image/jpg, application/pdf"
                                            prepend-inner-icon="mdi-paperclip"
                                            prepend-icon=""
                                        />
                                    </v-col>
                                </v-row>
                            </div>
                            <div class="d-flex" :class="`${hasLicense ? 'justify-end' : 'justify-start'}`">
                            <v-btn 
                                @click="AddLicense" 
                                color="success"
                                variant="elevated"
                                rounded="xl"
                                class="mb-4 mx-5"
                            >
                                <v-icon start>mdi-plus</v-icon>
                                Add
                            </v-btn>
                            </div>
                            <div v-for="(item, idp) in list.license" :key="idp" class="added-item">
                                <div class="item-content">
                                    <h4>{{ item.name }}</h4>
                                    <v-btn 
                                        @click="viewDocument(item.file)" 
                                        color="primary"
                                        variant="tonal"
                                        size="small"
                                        rounded="xl"
                                    >
                                        <v-icon start>mdi-file-document</v-icon>
                                        {{ item.file?.name }}
                                    </v-btn>
                                </div>
                                <v-btn 
                                    @click="RemoveLicense(idp)"
                                    color="error"
                                    variant="text"
                                    icon="mdi-close"
                                    size="small"
                                />
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Save Button -->
                <div v-if="isEdit" class="text-center mt-0 pb-6">
                    <v-btn v-if="trainer.details.phone"
                        @click="isEdit = false"
                        variant="outlined"
                        size="large"
                        rounded="xl"
                        min-width="200"
                        class="cancel-btn me-2"
                    >
                        Cancel
                    </v-btn>
                    <v-btn 
                        @click="saveProfile" 
                        color="primary"
                        variant="elevated"
                        size="large"
                        rounded="xl"
                        min-width="200"
                        class="save-btn"
                    >
                        <!-- <v-icon start>mdi-content-save</v-icon> -->
                        Save Profile
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>

        <!-- Loading Overlay -->
        <v-overlay v-model="busy" class="align-center justify-center" contained>
            <v-progress-circular indeterminate size="64" width="5" color="primary"></v-progress-circular>
        </v-overlay>

        <!-- Document Preview Dialog -->
        <v-dialog v-model="viewDoc.status" persistent class="customDialog">
            <v-card class="modern-dialog">
                <v-card-title class="text-center pa-3">
                    <h3>Document Preview</h3>
                </v-card-title>
                <v-card-text class="pa-2">
                    <div class="preview-container">
                        <img :src="mx.getFile(viewDoc.data)" class="preview-image" />
                    </div>
                </v-card-text>
                <v-card-actions class="pa-2 justify-center">
                    <v-btn 
                        @click="viewDoc.status = false" 
                        variant="outlined"
                        rounded="xl"
                        class="px-4"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="passwordModel.status" persistent class="customDialog">
            <v-card class="modern-dialog">
                <v-card-title class="gradient-bg text-white text-center pa-3">
                    <h3>Change Password</h3>
                </v-card-title>
                <v-card-text class="pa-4">
                    <v-form ref="formRef">

                    
                    <v-text-field
                        v-model="passwordModel.current"
                        label="Password"
                        variant="outlined"
                        density="comfortable"
                        :type="passwordModel.show[0] ? 'text' : 'password'"
                        @click:append-inner="passwordModel.show[0] = !passwordModel.show[0]"
                        :append-inner-icon="passwordModel.show[0] ? 'mdi-eye' : 'mdi-eye-off'"
                        min-width="400"
                        class="mb-2"
                        :error-messages="passwordModel.current_error"
                        />
                    <v-text-field
                        v-model="passwordModel.password"
                        label="New Password"
                        variant="outlined"
                        density="comfortable"
                        :type="passwordModel.show[1] ? 'text' : 'password'"
                        @click:append-inner="passwordModel.show[1] = !passwordModel.show[1]"
                        :append-inner-icon="passwordModel.show[1] ? 'mdi-eye' : 'mdi-eye-off'"
                        class="mb-2"
                        />
                    <v-text-field
                        v-model="passwordModel.confirmPassword"
                        label="Confirm Password"
                        variant="outlined"
                        density="comfortable"
                        :type="passwordModel.show[2] ? 'text' : 'password'"
                        @click:append-inner="passwordModel.show[2] = !passwordModel.show[2]"
                        :append-inner-icon="passwordModel.show[2] ? 'mdi-eye' : 'mdi-eye-off'"
                        class="mb-2"
                        :error-messages="passwordModel.confirm_error"
                        />
                        <v-expand-transition>
                            <div v-if="showPasswordRequirements" class="password-requirements mb-4 pa-2">
                                <div class="d-flex align-center mb-2 text-black">
                                <v-icon size="16" class="mr-2">mdi-shield-check</v-icon>
                                <span class="text-body-2 font-weight-medium">Password Requirements:</span>
                                </div>
                                
                                <div class="requirements-grid">
                                <div 
                                    v-for="(req, key) in passwordRequirements" 
                                    :key="key"
                                    class="requirement-item d-flex align-center mb-1"
                                >
                                    <v-icon 
                                    :color="req.met ? 'success' : 'error'" 
                                    size="16" 
                                    class="mr-2"
                                    >
                                    {{ req.met ? 'mdi-check-circle' : 'mdi-close-circle' }}
                                    </v-icon>
                                    <span 
                                    :class="req.met ? 'text-success' : 'text-error'"
                                    class="text-body-2"
                                    >
                                    {{ req.text }}
                                    </span>
                                </div>
                                </div>
                                        <!-- Password Strength Indicator -->
                                <div v-if="passwordModel.password" class="mb-4 pt-3">
                                <div class="d-flex justify-space-between align-center mb-1">
                                    <span class="text-body-2 text-black">Password Strength</span>
                                    <span class="text-body-2 font-weight-medium" :class="passwordStrength.colorClass">
                                    {{ passwordStrength.label }}
                                    </span>
                                </div>
                                <v-progress-linear
                                    :model-value="passwordStrength.score"
                                    :color="passwordStrength.color"
                                    height="4"
                                    rounded
                                />
                                </div>
                            </div>
                        </v-expand-transition>
                        <div class="d-flex justify-center pt-2" style="gap: 8px;">
                            <v-btn
                                variant="outlined"
                                width="120"
                                rounded="pill"
                                :disabled="isLoading"
                                @click="closePassword()"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                :color="canSubmit ? 'success' : 'grey'"
                                class="text-black"
                                width="120"
                                rounded="pill"
                                :variant="canSubmit ? 'elevated' : 'outlined'"
                                :disabled="!canSubmit"
                                :loading="isLoading"
                                @click="changePassword()"
                            >
                                {{ isLoading ? 'Changing...' : 'Update' }}
                            </v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, computed, onMounted, onBeforeMount, watch } from 'vue';
import { useSessionStore } from '@/stores/session';
import { useAlertStore } from '@/stores/alert';
import { decrypt, encrypt } from '@/utils/encryptDecrypt';
import { useMXStore } from '@/stores/mx';
import { year_rule } from '@/utils/rules';
import { UNIVERSITY_LIST, COURSE_LIST } from '@/constants/data';
import bcrypt from 'bcryptjs';
import { useRouter } from 'vue-router';
import { CookieManager } from '@/utils/cookieManager';

const CERTIFICATE_LIST = ref<any>([])
const { proxy } = getCurrentInstance()!
const session = useSessionStore()
const alertStore = useAlertStore()
const mx = useMXStore()
const router = useRouter()

const busy = ref(false)
const isEdit = ref(false)
const trainer = ref<any>({
    profile: session.user,
    details: session.details ? session.details[0] : {},
})
const preview = ref<string>("");
const selectedFile = ref<File | null>(null);

const model = ref<any>({
    picture: {},
    bio: '',
    phone: '',
    academic: {
        course: '',
        university: '',
        start: '',
        end: ''
    },
    professional: {
        certificate: '',
        issued_on: '',
        valid_until: ''
    },
    language: {
        name: '',
        level: ''
    },
    license: {
        name: '',
        issued_on: '',
        valid_until: ''
    },
    documents: null
});
const list = ref<any>({
   academic: [],
   professional: [],
   language: [],
   license: [],
   documents: []
});
const hasLicense = ref(false)
const viewDoc = ref<any>({});

const passwordModel = ref({
    status: false,
    current: '',
    password: '',
    confirmPassword: '',
    show: [false,false,false],
    current_error: '',
    confirm_error: ''
});
const isLoading = ref(false);
const formRef = ref();


// Computed properties
const passwordRequirements = computed(() => ({
  length: {
    text: 'At least 8 characters long',
    met: passwordModel.value.password.length >= 8
  },
  upper: {
    text: 'Include at least one uppercase letter',
    met: /[A-Z]/.test(passwordModel.value.password)
  },
  lower: {
    text: 'Include at least one lowercase letter',
    met: /[a-z]/.test(passwordModel.value.password)
  },
  number: {
    text: 'Include at least one number',
    met: /\d/.test(passwordModel.value.password)
  },
  special: {
    text: 'Include at least one special character (@$!%*?&)',
    met: /[@$!%*?&]/.test(passwordModel.value.password)
  }
}));

const showPasswordRequirements = computed(() => {
  return passwordModel.value.password.length > 0 ;
});

const passwordStrength = computed(() => {
  const password = passwordModel.value.password;
  if (!password) return { score: 0, label: '', color: 'grey', colorClass: '' };

  let score = 0;
  const requirements = passwordRequirements.value;

  // Calculate score based on requirements
  Object.values(requirements).forEach(req => {
    if (req.met) score += 20;
  });

  // Additional complexity bonus
  if (password.length >= 12) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;

  let label = '';
  let color = '';
  let colorClass = '';

  if (score < 40) {
    label = 'Weak';
    color = 'error';
    colorClass = 'text-error';
  } else if (score < 80) {
    label = 'Fair';
    color = 'warning';
    colorClass = 'text-warning';
  } else if (score < 100) {
    label = 'Good';
    color = 'info';
    colorClass = 'text-info';
  } else {
    label = 'Strong';
    color = 'success';
    colorClass = 'text-success';
  }

  return { score, label, color, colorClass };
});

const isPasswordValid = computed(() => {
  return Object.values(passwordRequirements.value).every(req => req.met);
});

const isConfirmPasswordValid = computed(() => {
  return passwordModel.value.confirmPassword === passwordModel.value.password && 
         passwordModel.value.confirmPassword.length > 0;
});
const canSubmit = computed(() => {
  return isPasswordValid.value && 
         isConfirmPasswordValid.value && 
         !isLoading.value;
});


if(!session.details){
    isEdit.value = true
}

const profileImg = computed(() => {
    let picture = trainer.value.details ? trainer.value.details.picture || {} : {}
    if (Object.keys(picture).length === 0) picture.filename = 'avatar.png'
    if(picture){
        picture = typeof picture == 'string' ? JSON.parse(picture) : picture
    }
    let baseUrl = mx.getFile(picture)
    return baseUrl
})

// Functions (keeping the original logic)
const validateForm = async (): Promise<boolean> => {
  if (!formRef.value) return false;
  
  const { valid } = await formRef.value.validate();
  return valid && isPasswordValid.value && isConfirmPasswordValid.value;
};
function closePassword(){
    passwordModel.value.show = [false,false,false]
    passwordModel.value.current = ''
    passwordModel.value.password = ''
    passwordModel.value.confirmPassword = ''
    passwordModel.value.status = false
}
async function changePassword(){
    let data = {
        trainerID : session.user.ID,
        current: passwordModel.value.current,
        password : passwordModel.value.password
    }
    const hashedPassword = await bcrypt.hash(passwordModel.value.current, 12); 

    const res = await proxy!.$api.changePass(data)
    if(!res.data.status) return alertStore.showAlert('warning', res.data.error, res.data.message, true)
    else{
        alertStore.showAlert('success', 'Success', 'Password changed successfully', true)
        closePassword()
    }
}
function viewDocument(file : any){
    let filename = '/images/' + file.filename
    let baseUrl = mx.getUrl(filename)
    viewDoc.value.data = file
    viewDoc.value.status = true

    // viewDoc.value = {
    //     status: true,
    //     url: baseUrl
    // }
}

function editProfile(){
    list.value.academic = trainer.value.details.academic
    list.value.professional = trainer.value.details.professional
    list.value.language = trainer.value.details.language
    list.value.license = trainer.value.details.license
    list.value.documents = trainer.value.details.documents
    if(trainer.value.details.license.length > 0) hasLicense.value = true
    model.value.phone = trainer.value.details.phone
    model.value.bio = trainer.value.details.bio
    model.value.picture = trainer.value.details.picture
    isEdit.value = true
}

function validatePhone(){
    let digits = model.value.phone.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 4 && digits.length <= 7) {
        model.value.phone = digits.replace(/(\d{4})(\d+)/, "$1-$2");
    } else if (digits.length > 7) {
        model.value.phone = digits.replace(/(\d{4})(\d{3})(\d+)/, "$1-$2-$3");
    } else {
        model.value.phone = digits;
    }
}

function validateYear(type : any){
    if(type == 1){
        let year = model.value.academic.start
        year = year.replace(/\D/g, "").slice(0, 4);
        model.value.academic.start = year
    }else if(type == 2){
        let year = model.value.academic.end
        year = year.replace(/\D/g, "").slice(0, 4);
        model.value.academic.end = year
    }else if(type == 3){
        let year = model.value.professional.issued_on
        year = year.replace(/\D/g, "").slice(0, 4);
        model.value.professional.issued_on = year
    }else if(type == 4){
        let year = model.value.professional.valid_until
        year = year.replace(/\D/g, "").slice(0, 4);
        model.value.professional.valid_until = year
    }
}

function AddAcademic(){
    if(model.value.academic.course == '' || model.value.academic.university == '' || model.value.academic.start == '' || model.value.academic.end == ''){
        return alertStore.showAlert('warning', '', 'Please fill all fields', true)
    } 
    if(!/^\d{4}$/.test(model.value.academic.start) || !/^\d{4}$/.test(model.value.academic.end)){
        return alertStore.showAlert('warning', '', 'Start and End Year should be a valid year', true)
    }
    if(parseInt(model.value.academic.start) > new Date().getFullYear()){
        return alertStore.showAlert('warning', '', 'Start year should be not be greater than current year 1', true)
    }
    if(parseInt(model.value.academic.end) < parseInt(model.value.academic.start)){
        return alertStore.showAlert('warning', '', 'End year should not be less than start year', true)
    }
    let startYear = parseInt(model.value.academic.start)
    let endYear = parseInt(model.value.academic.end)
    if(startYear < 1800 || startYear > 2200 || endYear < 1800 || endYear > 2200){
        return alertStore.showAlert('warning', '', 'Start and End Year should be a valid year', true)
    }
    let newData = { ...model.value.academic }
    list.value.academic.push(newData)
    list.value.academic.sort((a : any, b : any) => {
        return parseInt(b.start) - parseInt(a.start);
    })
    model.value.academic = {}
}

function RemoveAcademic(index: number){
    list.value.academic.splice(index, 1)
}

function AddProfessional(){
    if(model.value.professional.certificate == ''){
        return alertStore.showAlert('warning', '', 'Certificate Name is required', true)
    }
    if(model.value.professional.issued_on != '' && parseInt(model.value.professional.issued_on) > new Date().getFullYear()){
        return alertStore.showAlert('warning', '', 'Issue year should not be greater than current year', true)
    }
    if(model.value.professional.valid_until != '' && parseInt(model.value.professional.valid_until) < parseInt(model.value.professional.issued_on)){
        return alertStore.showAlert('warning', '', 'Valid until year should not be less than issue year', true)
    }
    let newData = { ...model.value.professional }
    list.value.professional.push(newData)
    model.value.professional.certificate = ''
}

function RemoveProfessional(index: number){
    list.value.professional.splice(index, 1)
}

function AddLanguage(){
    if(model.value.language.name == ''){
        return alertStore.showAlert('warning', '', 'Language Name is required', true)
    } 
    let existingLanguage = list.value.language.find((lang:any) => lang.name == model.value.language.name)
    if(existingLanguage){
        return alertStore.showAlert('warning', '', 'Language already exists', true)
    }

    let newData = { ...model.value.language }
    list.value.language.push(newData)
    model.value.language.name = ''
}

function RemoveLanguage(index: number){    
    list.value.language.splice(index, 1)
}

async function AddLicense(){
    if(hasLicense.value == false){
        return hasLicense.value = true
    }
    if(model.value.license.name == ''){
        return alertStore.showAlert('warning', '', 'License Name is required', true)
    }else if(model.value.documents == null){
        return alertStore.showAlert('warning', '', 'Document is required', true)
    }
    const res = await AddDocument()
    if(res != false){
        model.value.license.file = res
    } 
    let newData = { ...model.value.license }
    list.value.license.push(newData)
}

function RemoveLicense(index: number){
    list.value.license.splice(index, 1)
}

async function AddDocument(){
    const res : any = await saveImage(model.value.documents)
    if(res.data.status){
        const decrypted = decrypt(res.data.data)
        return decrypted
    }else{
        return false
    }
}

async function saveProfile(){
    if((!model.value.picture.filename) && !preview.value){
        return alertStore.showAlert('warning', '', 'Please upload a profile picture', true)
    }
    if(model.value.phone == '' || model.value.bio == '' || 
        // list.value.academic.length == 0 || 
        list.value.professional.length == 0 || list.value.language.length == 0 ){
        let msg = []
        if(model.value.phone == '') msg.push('Phone number')
        if(model.value.bio == '') msg.push('Bio')
        // if(list.value.academic.length == 0) msg.push('Academic')
        if(list.value.professional.length == 0) msg.push('Professional Certificate')
        if(list.value.language.length == 0) msg.push('Language')
        return alertStore.showAlert('warning', '', 'Please fill the following required fields: ' + msg.join(', '), true)
    }

    busy.value = true 
    let user = session.user
    let details = session.details ? session.details[0] : {}
    details.trainerID = parseInt(user.ID)
    details.phone = model.value.phone
    details.bio = model.value.bio
    details.academic = JSON.stringify(list.value.academic)
    details.professional = JSON.stringify(list.value.professional)
    details.language = JSON.stringify(list.value.language)
    details.license = JSON.stringify(list.value.license)
    details.picture = JSON.stringify(model.value.picture)
    details.unique_by = JSON.stringify(["trainerID"])
    
    if(preview.value){
        // const res = await saveImage(model.value.picture)
        const formData = new FormData();
        formData.append('image', model.value.picture);
        formData.append('filePath', `images/profile/trainer/${session.user.employeeNo}`);
        const res = await proxy!.$api.uploadImg(formData)
        await new Promise((resolve) => setTimeout(resolve, 500));
        const resData = res as { data: { status: boolean, error: string , data: object } }
        if(resData.data.status){
            let data = decrypt(resData.data.data)
            details.picture = JSON.stringify(data)
            preview.value = ''
        }else{
            alertStore.showAlert('warning', '', resData.data.error, true)
            return busy.value = false
        }
    }
    
    const res = await proxy!.$api.saveData('trainer_details',details)
    await new Promise((resolve) => setTimeout(resolve, 500));
    const resData = res as { data: { status: boolean, error: string , data: object } }

    if(!resData.data.status){
        alertStore.showAlert('error', '', res.data.error, true)
        return
    }else{
        alertStore.showAlert('success', '', 'Your profile has been updated', true)
        let decrypted = decrypt(res.data.data)
        let formatted = decrypted
        delete decrypted.academic
        delete decrypted.professional
        delete decrypted.bio
        delete decrypted.license
        session.setDetails(decrypted)
        // CookieManager.setCookie('_SessionInfo', JSON.stringify( encrypt([decrypted])) , 2);
        formatted.academic = JSON.parse(formatted.academic || '[]')
        formatted.professional = JSON.parse(formatted.professional || '[]')
        formatted.language = JSON.parse(formatted.language || '[]')
        formatted.license = JSON.parse(formatted.license || '[]')
        formatted.picture = JSON.parse(formatted.picture || '{}')
        trainer.value.details = formatted
    }

    isEdit.value = false
    busy.value = false
    setTimeout(() => {
        router.go(0)
    }, 1200);
}

function onImageChange(event: Event){
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        model.value.picture = file
        preview.value = URL.createObjectURL(file);
    }
}

async function saveImage(img : any){
    const formData = new FormData();
    formData.append('document', img);
    formData.append('filePath', `documents/profile/trainer/${session.user.employeeNo}`);
    try {
        const response = await proxy!.$api.uploadDoc(formData)
        return response
    } catch (error) {
        return error
    }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      // Clear the file input on error
      selectedFile.value = null;
      return alertStore.showAlert('warning', '', 'File size is too large. Maximum size is 5MB', true);
    }
    model.value.documents = file;
  }
}

async function saveFile(file : any){
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await proxy!.$api.uploadImg(formData)
        return response
    } catch (error) {
        return error
    }
}
watch(() => passwordModel.value.current, async () => {
    bcrypt.compare(passwordModel.value.current, session.user.password, function(err, result) {
        if (result === true) {
            // console.log('Password is correct!');
            passwordModel.value.current_error = ''
        } else {
            passwordModel.value.current_error = 'Current Password is incorrect';
        }
    });
})

watch(() => passwordModel.value.confirmPassword, () => {
    if(passwordModel.value.password != passwordModel.value.confirmPassword){
        passwordModel.value.confirm_error = 'Password does not match'
    }else{
        passwordModel.value.confirm_error = ''
    }
})

async function getCertList(){
    const res = await proxy!.$api.getData('list_certificates', { filters: { status: 1 }, limit: 100, order_by: { name: 'asc' } })
    CERTIFICATE_LIST.value = decrypt(res.data.data).map((item: any) => item.name)
}

async function getDetails(){
    const user = session.user
    let params = {
        filters: {
            trainerID: user.ID
        }
    }
    const promise = new Promise((resolve, reject) => {
        proxy!.$api.getData('trainer_details', params).then(response => resolve(response)).catch(error => reject(error));
    });
    const usr_dt : any = await promise;
    const decrypted = decrypt(usr_dt.data.data)
    if(decrypted.length > 0){
        decrypted[0].academic = JSON.parse(decrypted[0].academic)
        decrypted[0].professional = JSON.parse(decrypted[0].professional)
        decrypted[0].language = JSON.parse(decrypted[0].language)
        decrypted[0].license = JSON.parse(decrypted[0].license)
        decrypted[0].picture = JSON.parse(decrypted[0].picture)
        trainer.value.details = decrypted[0]
        isEdit.value = false
    }
}
onBeforeMount(async () => {
    await getDetails()
    await getCertList()
})
</script>

<style>

.customDialog div.v-overlay__content{
    width: auto !important;
}
</style>

<style scoped>


.profile-container {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
}

.profile-header {
    border-radius: 24px !important;
    overflow: hidden;
}

.profile-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}


@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.section-title {
    font-size: 28px;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
}

.avatar-section {
    text-align: center;
}

.avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 16px;
}

.avatar-main {
    border: 2px solid rgb(104, 130, 245);
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.avatar-main.hover-effect:hover {
    border-color: rgba(102, 126, 234, 0.5);
    transform: scale(1.05);
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.edit-mode:hover .avatar-overlay {
    opacity: 1;
}

.avatar-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border-radius: 50%;
}

.info-grid {
    gap: 16px;
}

.credential-subtitle {
    font-size: 16px;
    color: #667;
    margin-bottom: 12px;
}

.credential-meta,
.item-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.input-form {
    padding: 24px;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 16px;
    border: 2px dashed rgba(102, 126, 234, 0.2);
}

.item-content h4 {
    font-size: 16px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 8px;
}

.language-chips {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    min-height: 60px;
}

.license-item {
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    margin-bottom: 16px;
    border-left: 4px solid #667eea !important;
    border: 1px solid rgba(102, 126, 234, 0.2);
}

.license-title {
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 12px;
}

.edit-btn {
    transition: all 0.3s ease;
    text-transform: none;
    font-weight: 600;
}

.save-btn {
    background: linear-gradient(135deg, #617cf7 0%, #2f32f5 100%);
    color: white;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
}

.save-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.modern-dialog {
    border-radius: 24px !important;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
}

.preview-container {
    text-align: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 16px;
}

.preview-image {
    max-width: 100%;
    height: 55vh;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.required {
    color: #e53e3e;
    font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 960px) {
    .section-container {
        padding: 24px 16px;
        margin: 0 -16px;
    }
    
    .section-title {
        font-size: 24px;
    }
}

@media (max-width: 600px) {
    .profile-container {
        padding: 16px;
    }
    
    .gradient-bg {
        border-radius: 16px;
    }
    
    .profile-card {
        border-radius: 16px !important;
    }
    
    .section-container {
        padding: 20px 12px;
        margin: 0 -12px;
        border-radius: 16px;
    }
    
    .avatar-main {
        width: 120px;
        height: 120px;
    }
}
</style>